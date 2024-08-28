const router = require("express").Router();
const channelMessagesRepository = require("../repository/channel-messages-repository.js");
const messageRepository = require("../repository/message-repository.js");
const ws = require("../ws.js");

const createChannelMessage = async(channelMessage) => {
    await channelMessagesRepository.insert({
        channel_id: channelMessage.channel_id,
        message_id: channelMessage.message_id
    })

    const message = await messageRepository.select({id: channelMessage.message_id});
    const messageSendData = {
        type: "new_channel_message",
        message: message[0],
        channel_id: channelMessage.channel_id
    }

    const notificationSendData = {
        type: "new_channel_notification",
        channel_id: channelMessage.channel_id
    }

    const messageCountSendData = {
        type: "new_channel_message_count",
        channel_id: channelMessage.channel_id,
        from_users: message[0].from_users
    }

    for(const [userId, wsConnection] of Object.entries(ws.connections)){
        if(parseFloat(userId) !== messageSendData.message.from_users){
            wsConnection.send(JSON.stringify(messageSendData));
            wsConnection.send(JSON.stringify(notificationSendData));
            wsConnection.send(JSON.stringify(messageCountSendData));
        }
    }

    return channelMessage;
}

router.use((req,res,next) => {
    console.log("channelMessagesRouter: ");
    next();
})

router.post("/", (req,res) => {
    console.log(req.body, "rrrrrr");
    const channelMessage = createChannelMessage(req.body);
    res.json(channelMessage);
})

router.get("/", async(req, res) => {
    const {channel_id} = req.query;
    console.log(channel_id, "getId from channel messages")
    try{
        if(channel_id){
            const channelMessages = await channelMessagesRepository.select({
                channel_id
            })
        
        console.log(channelMessages, "kkk");
        res.json({channelMessages});
        return;
        }
    }catch(e){
        res.status(500);
        res.send(e.message);
    }
})


module.exports = router