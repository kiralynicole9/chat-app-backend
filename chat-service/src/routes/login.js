const router = require("express").Router();
const usersRepository = require("../repository/user-repository.js");

router.use((req,res,next) => {
    console.log("loginRouter: ");
    next();
});

router.post("/", async (req,res) => {
    console.log(req.body);
    const user = await usersRepository.select({
        username: req.body.email,
        password: req.body.password,
    });

    console.log('the user', user)
    if(!user) {
        res.sendStatus(401);
    }
    res.send(user);
})



module.exports = router