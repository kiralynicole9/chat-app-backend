const router = require("express").Router();
const messages = require('../repository/message-repository.js');
const notificationStatusRepository = require("../repository/notification-status-repository.js");
const ws = require("../ws.js");

const createNotificationStatus = async(notifStatus) => {
    await notificationStatusRepository.insert({
        notification_id: notifStatus.notification_id,
        user_id: notifStatus.user_id
    });

    const savedstatus = (await notificationStatusRepository.select({notification_id: notifStatus.notification_id, user_id: notifStatus.user_id}))[0]
    return savedstatus;
}

router.use((req,res,next) => {
    console.log("notificationStatusRouter: ");
    next();
})

router.post("/", (req, res) => {
    const {notification_id, user_id} = req.body;
    const newStatus = {
        notification_id,
        user_id
    }
    const notifStatus = createNotificationStatus(newStatus);
    res.json(notifStatus);
})

module.exports = router