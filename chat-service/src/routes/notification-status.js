const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const notificationStatusRepository = require("../repository/notification-status-repository.js");
const ws = require("../ws.js");

router.use((req,res,next) => {
    console.log("notificationStatusRouter: ");
    next();
})

router.patch("/:notification_id/:userId", async(req, res) => {
    const {notification_id, userId} = req.params;
    const {...result} = req.body;

    if(result.has_been_read !== undefined){
        result.has_been_read = !!result.has_been_read+0;
    }

    await notificationStatusRepository.updateWithCompositeKeyNotif({notification_id: notification_id, user_id: userId}, {
        ...result
    }) 

    const notifStatus = (await notificationStatusRepository.select({message_id: notification_id, user_id: userId}))[0]
    console.log(notifStatus, "yupi")
    res.send(notifStatus);
})


module.exports = router