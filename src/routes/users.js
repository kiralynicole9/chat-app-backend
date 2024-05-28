const router = require("express").Router();
const inMemoryDb = require("../data/inMemoryDB.js").inMemoryDb

console.log(inMemoryDb);
const users = inMemoryDb.users;


const createUser = (user) => {
    const userId = users.length + 1;
    users.push({...user, userId});
    return user;
}


router.use((req, res, next) => {
    console.log("usersRouter:");
    next();
})

router.get("/:userId?", (req, res) => {
    const {userId, ...userParams} = req.params;
    if(userId) {
        const user = users.find((user) =>  user.userId === parseFloat(userId))
        res.json(user);
        return;
    }

    res.json(users);
})

router.post("/", (req, res) => {
    console.log(req.body)
    const user = createUser(req.body);
    res.json(user);
})



module.exports = router