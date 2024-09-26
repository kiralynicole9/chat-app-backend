const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const notificationStatusRepository = require("../repository/notification-status-repository.js");
const ws = require("../ws.js");

router.use((req,res,next) => {
    console.log("notificationStatusRouter: ");
    next();
})

router.patch("/read/:notifId/:userId", async(req, res) => {
    const {notifId, userId} = req.params;
    const {...result} = req.body;

    if(result.has_been_read !== undefined){
        result.has_been_read = !!result.has_been_read+0;
    }

    await notificationStatusRepository.updateWithCompositeKeyNotif({notification_id: notifId, user_id: userId}, {
        ...result
    }) 

    ws.sendTo(userId, {
        type: "read_notification"
    })

    const notifStatus = (await notificationStatusRepository.select({notification_id: notifId, user_id: userId}))[0]
    console.log(notifStatus, "yupi")
    res.send(notifStatus);
})



module.exports = router