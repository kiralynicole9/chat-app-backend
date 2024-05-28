const router = require("express").Router();
const inMemoryDB = require("../data/inMemoryDB.js").inMemoryDb;

const messages = inMemoryDB.messages;

router.use((req,res,next) => {
    console.log("messageRouter: ");
    next();
})


const createMessage = (message) => {
    message.from = parseFloat(message.from);
    message.to = parseFloat(message.to);
    messages.push(message);

    return message;
}


router.get("/", (req,res) => { 
    console.log(req.query);
    const {from, to} = req.query
    if(from && to){
       const filteredMessages = messages.filter((message) => {
            if(from == message.from && to == message.to){
                return true;
            }
            if(to == message.from && from == message.to){
                return true;
            }
        })
        res.json(filteredMessages);
        return;
    }
    console.log(messages);
    res.json(messages);
})

router.post("/", (req,res) => {
    const message = createMessage(req.body);
    console.log(message)
    res.send(message);
})



module.exports = router