import { Server } from "socket.io";
import roomModel from "./models/room.js";
import { saveMessage } from "./controllers/messageController.js";
// import { send } from "process";

// const socketMap = {}

export const setupSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log("A user has connected")
    
        socket.on('disconnect', () => {
            console.log("A user has disconnected", socket.id)
        })
    
        socket.on('sendMessage', async (roomId, content, sender, media = null) => {
            if(roomId){
                // Save message to DB
                const messageData = {
                    content: content,
                    room_id: roomId,
                    sender: sender._id || sender, // handle both populated and id
                    sentAt: new Date(),
                    ...(media ? { media } : {})
                };
                const MessageModel = (await import('./models/message.js')).default;
                let msg = new MessageModel(messageData);
                await msg.save();
                // Update room's lastMessage
                await roomModel.findByIdAndUpdate(roomId, { lastMessage: msg._id });
                // Populate sender and media for frontend
                msg = await MessageModel.findById(msg._id).populate('sender');
                io.to(roomId).emit('receiveMessage', msg);
            }
        })

        socket.on('joinRoom', (userId, roomIds) => {
            // console.log(userId,roomIds, 'this is it')
            if (Array.isArray(roomIds) && roomIds.length > 0) {
                roomIds.forEach((roomId) => {
                    socket.join(roomId);
                });
            }

        })

        socket.on('roomUpdate', (roomId) => {
            if(roomId){
                io.to(roomId).emit('roomUpdate', roomId)
            }
        })

        socket.on('userKicked', (roomId, userId) => {
            if(roomId && userId){
                // console.log(roomId, 'sr', userId, 'su')
                io.to(roomId).emit('userKicked', {roomId, userId})
            }
        })
    })
}