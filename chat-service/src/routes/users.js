const userRepository = require("../repository/user-repository.js");
const router = require("express").Router();
const users = userRepository


const createUser = (user) => {
    const userId = users.length + 1;
    users.insert({
        username: user.username,
        password: user.password,
        email: user.email,
    });
    return user;
}


router.use((req, res, next) => {
    console.log("usersRouter:");
    next();
})

router.get("/:userId?", async (req, res) => {
    const {userId, ...userParams} = req.params;
    if(userId) {
        const user = await users.select({
            id: parseFloat(userId),
        });
        console.log(user, 'sss')
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