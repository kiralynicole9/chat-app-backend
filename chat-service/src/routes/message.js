const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const notificationRepository = require("../repository/notification-repository.js");
const ws = require("../ws.js");

const onMessage = (data, cookies)=>{
    console.log(cookies);
    const payload = JSON.parse(data);
    if(payload.type === "send_message"){
        (async () => {
            let savedMessage;
            if(payload.data.to_user){
                 savedMessage = await messages.createMessage({
                    from_users: cookies.user,
                    to_users: payload.data.to_user,
                    message: payload.data.message,
                    in_channel: payload.data.is_in_channel
                 });
            }else {
                 savedMessage = await messages.createMessage({
                    from_users: cookies.user,
                    message: payload.data.message,
                    in_channel: payload.data.is_in_channel
                });
            }
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
        }else if(from_users){
            const filteredMessages = (await messages.select([{
                from_users: from_users,
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

router.get("/:id", async(req, res) => {
    const {id} = req.params;
    if (id) {
        const message = await messages.select({
            id: parseFloat(id)
        });
        console.log(message, 'getIdddd');
        res.json(message[0]);
        return;
    }
    const allMessages = await messages.select();
    res.json(allMessages);
})

router.post("/", async (req,res) => {
    const message = await messages.createMessage(req.body);
    console.log(message, "postt")
    res.send(message);
})

router.patch("/:id", async (req, res) => {
    const {...result} = req.body;
    const {id} = req.params;
    console.log(id, result, "patch channel");
    if(result.has_been_read !== undefined){
        result.has_been_read = !!result.has_been_read+0;
    }
    await messages.update({
        id,
        ...result
    })
    const message = (await messages.select({id}))[0]
    console.log(message, "kpl")
    res.send(message);
})

router.get("/count/:userId", async(req,res) => {
    const {userId} = req.params;
    const results = await messages.countFromUserMessages(userId)
    res.send(results)
})



module.exports = router