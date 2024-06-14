const router = require("express").Router();
const usersRepository = require("../repository/user-repository.js");
const ws = require("../ws.js");

router.post("/", async (req, res) => {
    const {email} = req.body;
    const users= await usersRepository.select({email});
    for(const user of users){
        console.log(user);
        await usersRepository.update({
            id: user.id,
            active: 0
        })
        ws.broadcast({
            type: "user_offline",
            data: {
                userId: user.id
            }

        })
    }
    res.send();
})

module.exports=router