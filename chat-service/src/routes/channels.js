const router = require("express").Router();
const { captureRejectionSymbol } = require("ws");
const channelsRepository = require("../repository/channels-repository.js");
const ws = require("../ws.js");

const createChannel = (channel) => {
    const channelId = channelsRepository.length + 1;
    channelsRepository.insert({
        name: channel.name
    });
    return channel;
}

router.use((req,res,next) => {
    console.log("channelRouter: ");
    next();
});

//create a channel

router.post("/", (req,res) => {
    const name = req.body;
    console.log(name, "createChanneeel")
    const channel = createChannel(name);
    res.json(channel);
})

router.get("/", async (req,res) => {
    console.log(req.query, "getNameee");
    const {name} = req.query;
    console.log(name, "nameee");

    try{

        if(name){
            const filteredChannels = await channelsRepository.select({
                name
            })
            res.json(filteredChannels);
            return;
        }
        
    }catch (e) {
        res.status(500);
        res.send(e.message);
    }
})

router.get("/:id", async(req, res) => {
    const {id} = req.params;
    try{
        const channels =  await channelsRepository.select({id: parseFloat(id)})
        res.json(channels);
    }catch(e){
        res.status(500);
        res.send(e.message);
    }

})

module.exports = router