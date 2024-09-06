const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { TOKEN_MISING, INVALID_TOKEN, FORBIDDEN_MESSAGE } = require('../helper/message');
require('dotenv').config();

const signAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        const payload = {
            owner_id: user.owner_id || null,
            user_id: user.user_id || null
        };
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            subject: `${user.id}`,
            audience: 'xyz',
            expiresIn: '10h'
        };

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
};

const varifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(401).json({ error: true, msg: TOKEN_MISING });
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: true, msg: INVALID_TOKEN });
        }
        req.payload = payload;
        next();
    });
};

module.exports = { signAccessToken, varifyAccessToken };
