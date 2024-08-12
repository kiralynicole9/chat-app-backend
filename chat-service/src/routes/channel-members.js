const router = require("express").Router();
const channelMembersRepository = require("../repository/channel-members-repository.js");
const channelsRepository = require("../repository/channels-repository.js");
const userRepository = require("../repository/user-repository.js");
const ws = require("../ws.js");

const createChannelMember = async (channel) => {
   await channelMembersRepository.insert({
        user_id: channel.user_id,
        channel_id: channel.channel_id
    })

    return channel;
}

router.use((req,res,next) => {
    console.log("channelMembersRouter: ");
    next();
});

//add a member to channel

router.post("/", async(req,res) => {
    const {user_id, channel_id} = req.body;
    const newChannel = {
        user_id,
        channel_id
    }
    console.log(newChannel, "hhh")
    const channel = await createChannelMember(newChannel);
    const channelDetails = await channelsRepository.select({
        id:channel_id,
    });
    ws.sendTo(channel.user_id, {
        type: "new_channel",
        channel:channelDetails
    });
    console.log(channel, "mmmm");
    res.json(channel);

})

//get channel by member id

router.get("/", async (req, res) => {
    const {user_id, channel_id} = req.query;
    
    try{
        if(user_id) {
            const channels = await channelMembersRepository.select({
                user_id,
            });
            
            // ws.broadcast({
            //         type: "get_channel"
            //     });
            console.log(channels, 'channelquery')
            res.json({channels});
            return;
        }else if (channel_id){
            const members = await channelMembersRepository.select({
                channel_id
            });
            console.log(members, 'membersss');
            res.json({members});
            return;
        }
    }
    catch(e){
        res.status(500);
        res.send(e.message);
    }
})


module.exports = router