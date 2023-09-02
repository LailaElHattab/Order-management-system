const express = require('express');
const UserModel = require('../model/user-model');

const router = express.Router();
router.get('/', async (req, res) => {
    const username = req.user.username;
    const user = await UserModel.findOne({ "username": { $regex: new RegExp(username, "i") } });
    console.log(username);
    res.status(200).json({
        name: user.fullName,
    });
});

module.exports = router;