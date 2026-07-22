const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id, role, schoolId, sessionId = null) => {
    return jwt.sign(
        { id, role, schoolId, sessionId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRES_IN || '1d' }
    );
};

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const REFRESH_TOKEN_EXPIRES_DAYS = 30;

module.exports = { generateToken, generateRefreshToken, REFRESH_TOKEN_EXPIRES_DAYS };