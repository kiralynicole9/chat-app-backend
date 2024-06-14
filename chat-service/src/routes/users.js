const userRepository = require("../repository/user-repository.js");
const ws = require("../ws.js");
const router = require("express").Router();
const users = userRepository


const createUser = (user) => {
    const userId = users.length + 1;
    users.insert({
        username: user.username,
        password: user.password,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName
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
        res.json(user[0]);
        return;
    }
    const allUsers = await users.select();
    res.json(allUsers);
})

router.post("/", (req, res) => {
    console.log(req.body)
    const user = createUser(req.body);
    res.json(user);
})

router.patch("/:userId?", async (req, res) => {
    console.log(req.params.userId, "user updateee");
    if(!req.params.userId) return;
    try{
        const updateFields = {id: parseFloat(req.params.userId), ...req.body};
        await users.update({...updateFields});
        const usersList = await users.select({id: parseFloat(req.params.userId)})
        const user = usersList[0]
        ws.broadcast({
            type: "users_status_update",
            data: {
                status: user.status,
                userId: user.id
            }
        })
        console.log(user, "444");
        res.send(user);
    }catch(e){
        res.statusCode = 500;
        res.send(e.message);
    }
})



module.exports = router