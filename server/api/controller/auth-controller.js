
const express = require('express');
const logger = require('../helpers/logger');
const { isEmpty } = require('../helpers/utils');
const { validatePassword, signToken } = require('../helpers/encrypt');
const UserModel = require('../model/user-model');
const COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : false,
}

const router = express.Router();
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (isEmpty(username) || isEmpty(password)) {
            return res.status(400).json({ message: "username or password is missing!" });
        }

        const user = await UserModel.findOne({ username: username.toLowerCase() })
        if (!user || !(await validatePassword(password, user.password))) {
            res.status(401).json({ message: "Invalid Credentials" });
        } else {
            const token = signToken({ username, fullName: user.fullName });

            res.cookie('access_token', token, COOKIE_OPTIONS).status(200).json({
                name: user.fullName,
                token,
            })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        logger.error('Error at login', { error });
    }
});

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('access_token', COOKIE_OPTIONS);
        res.status(200).end();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        logger.error('Error at login', { error });
    }
});



module.exports = router;