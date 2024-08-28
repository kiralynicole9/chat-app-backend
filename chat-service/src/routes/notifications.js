const router = require("express").Router();
const notificationRepository = require('../repository/notification-repository.js');
const userRepository = require("../repository/user-repository.js");
const ws = require("../ws.js");


router.use((req,res,next) => {
    console.log("notifRouter:");
    next();
})

router.get("/", async (req,res) => {
    console.log(req.query, "aaaa");
    if(!req.query.user && !req.query.channelId){
        res.statusCode = 403
        res.send();
        return;
    }
     
    try{
        let notifications = [];
        if(req.query.user){
            notifications = (await notificationRepository.select({to_user: req.query.user, has_been_read: 0}));
            for(const notification of notifications){
                const {email, password, ...user} = (await userRepository.select({id: notification.from_user}))[0];
                notification.from_user = user;
            }
        }else if (req.query.channelId){
            notifications = (await notificationRepository.select({channel_id: req.query.channelId}));
            for(const notification of notifications){
                const {email, password, ...user} = (await userRepository.select({id: notification.from_user}))[0];
                notification.from_user = user;
            }
        }
        console.log("notificationsss", notifications)
        res.json(notifications);
        return;    

    }catch(e){
        res.status(500);
        res.send(e.message);
    }   
})


router.patch("/:id", async (req, res) => {
    console.log(req.body, "HERE");
    try{
        const updateFields = {id: req.params.id, ...req.body};
        await notificationRepository.update({...updateFields})
        const notification = await notificationRepository.select({id: req.params.id})
        ws.sendTo(notification[0]?.to_user, {
            type: "read_notification"
        })
        console.log()
        res.send(updateFields);
    }catch(e){
        res.status(500);
        res.send(e.message);
    }
})


module.exports = router