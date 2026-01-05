import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';

// Generate access token (15 minutes)
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { userId },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
};

// Generate refresh token (7 days)
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

// Verify access token
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};
