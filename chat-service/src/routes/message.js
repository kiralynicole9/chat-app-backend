const router = require("express").Router();
const messages = require('../repository/message-repository.js');

router.use((req,res,next) => {
    console.log("messageRouter: ");
    next();
})


const createMessage = async (message) => {

    const savedMessage = await messages.insert({
        from_users: message.from_users,
        to_users: message.to_users,
        message: message.text});
    return savedMessage;
}


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
    const message = createMessage(req.body);
    console.log(message)
    res.send(message);
})



module.exports = router