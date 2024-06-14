const router = require("express").Router();
const usersRepository = require("../repository/user-repository.js");
const ws = require("../ws.js");

router.use((req,res,next) => {
    console.log("loginRouter: ");
    next();
});

router.post("/", async (req,res) => {
    //broadcast all users (ws) about this login user status
    console.log(req.body);
    const user = await usersRepository.select({
        email: req.body.email,
        password: req.body.password,
    });

    console.log('the user', user)
    if(!user.length) {
        res.sendStatus(401);
    }
    ws.broadcast({
        type: "user_online",
        data: {
            userId: user[0]?.id
        }
    })
    await usersRepository.update({
        id: user[0]?.id,
        active: 1
    })
    res.send(user[0]);
})



module.exports = router