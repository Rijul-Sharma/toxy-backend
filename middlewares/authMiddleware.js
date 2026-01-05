import { verifyAccessToken } from '../utils/jwtUtils.js';

export const verifyToken = (req, res, next) => {
    try {
        // Extract access token from cookies
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ error: 'Access token not found. Please log in.' });
        }

        // Verify the access token
        const decoded = verifyAccessToken(accessToken);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid or expired access token.' });
        }

        // Attach user ID to request object
        req.user = { userId: decoded.userId };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Internal server error during token verification.' });
    }
};
