import 'dotenv/config';
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import messageRoutes from './routes/messageRoutes.js'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import roomRoutes from './routes/roomRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import unreadRoutes from './routes/unreadRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { setupSocketEvents } from './socket.js';

const app = express();

// CORS configuration with credentials support
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(cookieParser());

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:5173',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173'
        ],
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type']
      }
})

const PORT = process.env.PORT

const dbURL = process.env.MONGO_URI;

mongoose.connect(dbURL)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.log("Error connecting to MongoDB", err))

app.get('/', (req,res) => {
    res.send("Server is running")
})

// app.listen(PORT, () => {
//     console.log(`Example app listening on port ${PORT}`)
// })

app.use(express.json())

app.use("/api/message", messageRoutes)
app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/room", roomRoutes)
app.use("/api/image", imageRoutes)
app.use("/api/unread", unreadRoutes)

setupSocketEvents(io)

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
