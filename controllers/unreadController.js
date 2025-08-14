import userModel from "../models/user.js";
import messageModel from "../models/message.js";
import roomModel from "../models/room.js";

// Mark room as read for a user
export const markRoomAsRead = async (req, res) => {
    try {
        const { userId, roomId } = req.body;

        if (!userId || !roomId) {
            return res.status(400).json({ error: "userId and roomId are required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find existing read status for this room
        const existingReadStatus = user.roomReadStatus.find(
            status => status.roomId.toString() === roomId
        );

        if (existingReadStatus) {
            // Update existing read status
            existingReadStatus.lastReadAt = new Date();
        } else {
            // Add new read status
            user.roomReadStatus.push({
                roomId: roomId,
                lastReadAt: new Date()
            });
        }

        await user.save();

        res.status(200).json({ 
            message: "Room marked as read successfully",
            lastReadAt: new Date()
        });
    } catch (error) {
        console.error("Error marking room as read:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get unread counts for all user's rooms
export const getUnreadCounts = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "userId is required" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const unreadCounts = {};

        // Calculate unread count for each room
        for (const roomId of user.rooms) {
            const roomIdString = roomId.toString();
            
            // Find user's last read time for this room
            const readStatus = user.roomReadStatus.find(
                status => status.roomId.toString() === roomIdString
            );

            let lastReadAt;
            if (readStatus) {
                lastReadAt = readStatus.lastReadAt;
            } else {
                // If no read status exists, consider all messages as unread
                lastReadAt = new Date('2000-01-01');
            }

            // Count messages in this room after lastReadAt (excluding user's own messages)
            const unreadCount = await messageModel.countDocuments({
                room_id: roomIdString,
                sentAt: { $gt: lastReadAt },
                sender: { $ne: userId }
            });

            unreadCounts[roomIdString] = unreadCount;
        }

        res.status(200).json({ unreadCounts });
    } catch (error) {
        console.error("Error getting unread counts:", error);
        res.status(500).json({ error: error.message });
    }
};
