const repository = require('./repository')

const notificationStatusRepository = Object.create(repository);

notificationStatusRepository.select = async function (data) {
    return this.db.select('channel_notification_status', data);
}

notificationStatusRepository.insert = async function(data){
    return this.db.insert('channel_notification_status', data);
}

notificationStatusRepository.update = async function(data){
    return this.db.update('channel_notification_status', data);
}

notificationStatusRepository.updateWithCompositeKeyNotif = async function(keys, data){
    return this.db.updateWithCompositeKeyNotif('channel_notification_status', keys, data);
}

notificationStatusRepository.delete = async function(where){
    return this.db.delete('channel_notification_status', where);
}

module.exports = notificationStatusRepository;