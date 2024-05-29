const router = require("express").Router();
const messages = require('../repository/message-repository.js');

router.use((req,res,next) => {
    console.log("messageRouter: ");
    next();
})


const createMessage = (message) => {
    message.from = parseFloat(message.from);
    message.to = parseFloat(message.to);
    messages.insert({from_users: message.from, to_users: message.to, message: message.message});

    return message;
}


router.get("/", async (req,res) => { 
    console.log(req.query);
    const {from, to} = req.query
    if(from && to){
       const filteredMessages = (await messages.select({
        from_users: from,
        to_users: to,
       }))
        res.json(filteredMessages);
        return;
    }

    res.json(await messages.select());
})

router.post("/", (req,res) => {
    const message = createMessage(req.body);
    console.log(message)
    res.send(message);
})



module.exports = router