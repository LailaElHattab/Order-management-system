const express = require('express');
const { verifyToken } = require('../helpers/encrypt');

const getTokenFromHeader = (req) => {
    const auth = req.header('Authorization');
    if (!auth) return;
    const mtoken = auth.split(' ');
    if (!(mtoken.length == 2 && 'Bearer' === mtoken[0])) {
        return;
    }
    const token = mtoken[1];
    return token;
};

const checkToken = (req, res, next) => {
    let token = req.cookies?.access_token;

    if (!token) {
        token = getTokenFromHeader(req);
    }

    if (!token) {
        return res.status(401).send('Access denied, no access token has been provided.');
    }
    
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).send('Access denied, invalid access token.');
    }
};

const router = express.Router();
router.use(checkToken);
module.exports = router