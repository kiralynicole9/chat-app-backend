const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const notificationRepository = require("../repository/notification-repository.js");

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



module.exports = router