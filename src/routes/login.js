const router = require("express").Router();
const inMemoryDb = require("../data/inMemoryDB.js").inMemoryDb;

router.use((req,res,next) => {
    console.log("loginRouter: ");
    next();
});

router.post("/", (req,res) => {
    const user =  inMemoryDb.users.find((user) => {
        return user.email === req.body.email && user.password === req.body.password;
    })
    if(!user) {
        res.sendStatus(401);
    }
    res.send(user);
})



module.exports = router