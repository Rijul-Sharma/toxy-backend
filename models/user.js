import { Schema,model } from "mongoose";

const userSchema = Schema({
    email : {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    },
    rooms : {
        type: [Schema.Types.ObjectId],
        ref: 'room'
    },
    icon : {
        type: Schema.Types.ObjectId,
        ref: 'image'
    },
    roomReadStatus: [{
        roomId: {
            type: Schema.Types.ObjectId,
            ref: 'room',
            required: true
        },
        lastReadAt: {
            type: Date,
            default: Date.now
        }
    }]
    },
    { versionKey: false }
)

let userModel = model('user',userSchema)

export default userModel