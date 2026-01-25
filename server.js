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

const allowedOrigins = [
    'https://toxy.app',
    'https://www.toxy.app',

    // dev
    'http://localhost:4173',
    'http://localhost:3000',
    'http://127.0.0.1:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));
app.use(cookieParser());

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});
const PORT = process.env.PORT || 5000;

const dbURL = process.env.MONGO_URI;

mongoose.connect(dbURL)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.log("Error connecting to MongoDB", err))
    
app.use(express.json())


app.get('/', (req,res) => {
    res.send("Server is running")
})


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
