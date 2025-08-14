import userModel from "../models/user.js";
import roomModel from "../models/room.js";
import bcrypt from "bcrypt";

export const Signup = async (req,res) => {
    try {
        const {email, name, password} = req.body;
        
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
        
        // Remove password from response for security
        const userResponse = newUser.toObject();
        delete userResponse.password;
        
        res.status(200).json(userResponse);

    } catch (err) {
        console.log("Signup error:", err);
        res.status(500).json({ error: "Internal server error during signup" });
    }
}

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
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        // Compare provided password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        // Remove password from response for security
        const userResponse = user.toObject();
        delete userResponse.password;
        
        return res.status(200).json(userResponse);
        
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).json({ error: "Internal server error during login" });
    }
}