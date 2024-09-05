const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const messagesStatusRepository = require("../repository/messages-status-repository.js");
const ws = require("../ws.js");

const createMessageStatus = (messageStatus) => {
    messagesStatusRepository.insert({
        message_id: messageStatus.message_id,
        user_id: messageStatus.user_id
    });
    return messageStatus;
}

router.use((req,res,next) => {
    console.log("messageRouter: ");
    next();
})

router.use("/", (req, res) => {
    const messageStatus = createMessageStatus(req.body);
    res.json(messageStatus);
})

module.exports = router 