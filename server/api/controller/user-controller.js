const express = require('express');
const logger = require('../helpers/logger');
const { isEmpty } = require('../helpers/utils');
const { hashPassword } = require('../helpers/encrypt');
const UserModel = require('../model/user-model');

const router = express.Router();
router.post('/', async (req, res) => {
    try {
        let { username, password, firstName, lastName } = req.body;
        if (isEmpty(username) || isEmpty(password) || isEmpty(firstName) || isEmpty(lastName)) {
            return res.status(400).json({ message: "Required data are missing!" });
        }
        username = username.toLowerCase()
        //check if username already exists
        const dbUser = await UserModel.findOne({ username });
        if (dbUser) {
            return res.status(400).json({ message: "username already exist." });
        }
        const hashedPass = await  hashPassword(password);
        const fullName = `${firstName || ''} ${lastName || ''}`.trim();
        const user = await UserModel.create({ firstName, lastName, fullName, username, password:hashedPass });
        res.status(200).json({
            user: user.fullName,
            username: user.username
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        logger.error('Error at create user', { error });
    }
})
module.exports = router;