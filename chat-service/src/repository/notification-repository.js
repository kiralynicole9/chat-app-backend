const repository = require('./repository')

const notificationRepository = Object.create(repository);

notificationRepository.select = async function (data) {
    return this.db.select('notifications', data);
}

notificationRepository.insert = async function(data){
    return this.db.insert('notifications', data);
}

notificationRepository.update = async function(data){
    return this.db.update('notifications', data);
}

notificationRepository.delete = async function(where){
    return this.db.delete('notifications', where);
}

module.exports = notificationRepository;