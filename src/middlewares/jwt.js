const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader; // Directly use the token from the authorization header

    try {
        const decoded = jwt.verify(token, 'dimasganteng1111');
        req.user = decoded.user; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        return res.status(500).json({ message: err.message });
    }
};

module.exports = authenticateJWT;
