const router = require("express").Router();
const channelMessagesRepository = require("../repository/channel-messages-repository.js");
const messages = require('../repository/message-repository.js');
const messagesStatusRepository = require("../repository/messages-status-repository.js");
const notificationRepository = require("../repository/notification-repository.js");
const notificationStatusRepository = require("../repository/notification-status-repository.js");
const ws = require("../ws.js");

const createMessageStatus = async(messageStatus) => {
    await messagesStatusRepository.insert({
        message_id: messageStatus.message_id,
        user_id: messageStatus.user_id
    });

    const notificationId = (await notificationRepository.select({id_message: messageStatus.message_id}))[0];
    console.log(notificationId.id, "777");

    await notificationStatusRepository.insert({
        notification_id: notificationId.id,
        user_id: messageStatus.user_id
    })

    const channelId = (await channelMessagesRepository.select({message_id: messageStatus.message_id}))[0];
    console.log(channelId.channel_id, "+++");
    
    ws.sendTo(messageStatus.user_id, {
        type: "new_channel_message-count",
        channel_id: channelId.channel_id
    })
        
    const savedstatus = (await messagesStatusRepository.select({message_id: messageStatus.message_id, user_id: messageStatus.user_id}))[0]
    return savedstatus;
}

router.use((req,res,next) => {
    console.log("messagesStatusRouter: ");
    next();
})

router.post("/", async(req, res) => {
    console.log(req.body, ".,");
    const {message_id, user_id} = req.body;
    const newStatus = {
        message_id,
        user_id
    }
    const messageStatus = await createMessageStatus(newStatus);
    console.log(messageStatus, "ppp");
    res.json(messageStatus);
})

router.patch("/read/:messageId/:userId", async(req,res) => {
    const {messageId, userId} = req.params;
    const {...result} = req.body;

    console.log(messageId, userId, "]]]]]")

    if(result.has_been_read !== undefined){
        result.has_been_read = !!result.has_been_read+0;
    }

    const a = await messagesStatusRepository.updateWithCompositeKey({message_id: messageId, user_id: userId}, {
        ...result
    }) 

    const messageStatus = (await messagesStatusRepository.select({message_id: messageId, user_id: userId}))[0]
    console.log(messageStatus, "///")
    res.send(messageStatus);
})

router.get("/countFromChannels/:userId", async(req,res) => {
    const {userId} = req.params;
    const results = await messagesStatusRepository.countMessages(userId);
    console.log(results, "333");
    res.send(results)
})

module.exports = router 