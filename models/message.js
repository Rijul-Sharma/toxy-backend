import { Schema,model } from "mongoose";

const messageSchema = Schema({
    content: {
        type: String,
    },
    room_id: {
        type: Schema.Types.ObjectId,
        ref: 'room',
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    media: [
        {
            type: {
                type: String, // 'image', 'video', etc.
            },
            url: String,
            thumbnail: String,
            name: String
        }
    ]
    },
    { versionKey: false }
)

let messageModel = model('message', messageSchema)

export default messageModel