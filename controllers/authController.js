import userModel from "../models/user.js";
import roomModel from "../models/room.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtils.js";

// Helper function to set auth cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
    
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const Signup = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        
        // Validate input
        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        // Check if user already exists
        const existingUser = await userModel.findOne({email});
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email" });
        }
        
        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create new user with hashed password
        const newUser = new userModel({ 
            email, 
            name, 
            password: hashedPassword 
        });
        
        await newUser.save();
        
        // Generate tokens
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);
        
        // Set auth cookies
        setAuthCookies(res, accessToken, refreshToken);
        
        // Return success response (no user object, no tokens)
        res.status(200).json({ message: "Signup successful" });

    } catch (err) {
        console.log("Signup error:", err);
        res.status(500).json({ error: "Internal server error during signup" });
    }
};

export const Login = async (req,res) => {
    try {
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        
        // Find user by email
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({ error: "User not found. Please check your email or sign up." });
        }
        
        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password. Please try again." });
        }
        
        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        
        // Set auth cookies
        setAuthCookies(res, accessToken, refreshToken);
        
        // Return success response (no user object, no tokens)
        res.status(200).json({ message: "Login successful" });
        
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ error: "Internal server error during login" });
    }
};

// Get current user profile (protected route)
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Fetch user from database
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Return safe user profile
        res.status(200).json(user);
        
    } catch (err) {
        console.log("GetCurrentUser error:", err);
        res.status(500).json({ error: "Internal server error while fetching user" });
    }
};

// Refresh access token (protected by refresh token)
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token not found" });
        }
        
        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired refresh token" });
        }
        
        // Generate new access token
        const userId = decoded.userId;
        const newAccessToken = generateAccessToken(userId);
        
        // Update access token cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });
        
        res.status(200).json({ message: "Token refreshed successfully" });
        
    } catch (err) {
        console.log("RefreshToken error:", err);
        res.status(500).json({ error: "Internal server error while refreshing token" });
    }
};

// Logout (clear both cookies)
export const logout = async (req, res) => {
    try {
        // Clear both cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        
        res.status(200).json({ message: "Logout successful" });
        
    } catch (err) {
        console.log("Logout error:", err);
        res.status(500).json({ error: "Internal server error during logout" });
    }
};