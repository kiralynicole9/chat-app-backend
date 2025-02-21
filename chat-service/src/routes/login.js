const router = require("express").Router();
const usersRepository = require("../repository/user-repository.js");
const ws = require("../ws.js");
const jwt = require ("jsonwebtoken");

router.use((req,res,next) => {
    console.log("loginRouter: ");
    next();
});

const SECRET_KEY = "my_secret_key";

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

    const token = jwt.sign(
        {
            userId: user[0].id,
            email: user[0].email
        },
        SECRET_KEY,
        {
            expiresIn: "1h"
        }
    );

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
    res.send({
        user: user[0],
        token
    });
})



module.exports = router