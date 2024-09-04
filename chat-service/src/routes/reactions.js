const router = require("express").Router();
const reactionsRepository = require("../repository/reactions-repository");
const channelMembersRepository = require("../repository/channel-members-repository")
const ws = require("../ws.js");

const createReaction = async(reaction) => {
    const reactionId = reactionsRepository.length + 1;
    await reactionsRepository.insert({
        message_id: reaction.message_id,
        user_id: reaction.user_id,
        reaction: reaction.reaction
    })

    return reaction;
}

router.use((req,res,next) => {
    console.log("channelMembersRouter: ");
    next();
});

router.post("/", async(req,res) => {
    const {to_user,channel_id, ...reaction} = req.body;
    console.log(to_user,channel_id, "}}")
    const createdReaction = await createReaction(reaction);
    if(to_user){
        ws.sendTo(to_user, {
            type: "new_reaction",
            createdReaction
        })
    }else if (channel_id){
        
        const channelMembers = await channelMembersRepository.select({channel_id});
        console.log(channelMembers, "----");
        for(const channelMember of channelMembers){
            ws.sendTo(channelMember.user_id, {
                type: "new_reaction",
                createdReaction
            })
        }

    }
    res.json(createdReaction);

})

router.get("/", async(req, res) => {
    const reactions = await reactionsRepository.select();
    console.log(reactions, ">>>")
    res.json(reactions);
})


module.exports = router