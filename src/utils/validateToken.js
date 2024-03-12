const jwt = require('jsonwebtoken');

exports.validateToken = (token) => {
    // const token = req.headers.authorization?.split(' ')[1];
    console.log('token',token)
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Verify token
    jwt.verify(token, 'ABCDEF', (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        return decoded; 
        next(); 
    });
};

