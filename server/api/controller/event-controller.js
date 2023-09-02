const express = require('express');
const router = express.Router();
const logger = require('../helpers/logger');

let registeredUsers = [];

router.get('/', (req, res) => {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const data = `data: ${JSON.stringify({ event: 'registered', payload: {} })}\n\n`;
    res.write(data);

    const username = req.user.username;
    registeredUsers.push({ username, res });
    logger.info('user has been registered', { username, count: registeredUsers.length });

    req.on('close', () => {
        logger.info('user has been un-register', { username, count: registeredUsers.length });
        registeredUsers = registeredUsers.filter(item => item.username === username);
    });

});

function sendNotification(event, payload, eventOwner) {
    logger.info('send notification', { event, id: payload?.id, eventOwner, count: registeredUsers.length });
    try {
        const data = { event, payload: payload };
        const msg = `data: ${JSON.stringify(data)}\n\n`;
        registeredUsers.forEach(item => {
            if (item.username !== eventOwner) {
                logger.info('send notification to user', { event, username: item.username });
                item.res.write(msg);
            }
        })
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    router, sendNotification
}