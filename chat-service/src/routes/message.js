const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const notificationRepository = require("../repository/notification-repository.js");
const ws = require("../ws.js");

const onMessage = (data, cookies)=>{
    console.log(cookies);
    const payload = JSON.parse(data);
    if(payload.type === "send_message"){
        (async () => {
           const savedMessage = await messages.createMessage({
                from_users: cookies.user,
                to_users: payload.data.to_user,
                text: payload.data.message
            });
            const message = await messages.select({id: savedMessage.id});
            const messageSendData = {
                type: "new_message",
                message
            }

            const notificationSendData = {
                type: "new_notification"
            }

            const messageCountSendData = {
                type: "new_message_count",
                from_user: parseFloat(cookies.user),
            }

            ws.connections[payload.data.to_user]?.send(JSON.stringify(notificationSendData));
            ws.connections[payload.data.to_user]?.send(JSON.stringify(messageSendData));
            ws.connections[payload.data.to_user]?.send(JSON.stringify(messageCountSendData));
            

            console.log(ws.connections[payload.data.to_user]);
        })();
    }

}
ws.messageListeners.push(onMessage);

router.use((req,res,next) => {
    console.log("messageRouter: ");
    next();
})



router.get("/", async (req,res) => { 
    console.log(req.query);
    try {
        const {from_users, to_users} = req.query;
        if(from_users && to_users){
           const filteredMessages = (await messages.select([{
            from_users: from_users,
            to_users: to_users,
           },
           {
            from_users: to_users,
            to_users: from_users,
           }
        ]))
            res.json(filteredMessages);
            return;
        }
    
        const data = await messages.select();

        res.json(data);
    } catch (e) {
        res.statusCode = 500;
        res.send(e.message);
    }
})

router.post("/", (req,res) => {
    const message = messages.createMessage(req.body);
    console.log(message)
    res.send(message);
})

router.patch("/:id", async (req, res) => {
    const {...result} = req.body;
    const {id} = req.params;
    if(result.has_been_read !== undefined){
        result.has_been_read = !!result.has_been_read+0;
    }
    await messages.update({
        id,
        ...result
    })
    const message = (await messages.select({id}))[0]
    res.send(message);
})

router.get("/count/:userId", async(req,res) => {
    const {userId} = req.params;
    const results = await messages.countFromUserMessages(userId)
    res.send(results)
})



module.exports = router