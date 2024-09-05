const repository = require('./repository')

const messagesStatusRepository = Object.create(repository);

messagesStatusRepository.select = async function (data) {
    return this.db.select('channel_messages_status', data);
}

messagesStatusRepository.insert = async function(data){
    return this.db.insert('channel_messages_status', data);
}

messagesStatusRepository.update = async function(data){
    return this.db.update('channel_messages_status', data);
}

messagesStatusRepository.delete = async function(where){
    return this.db.delete('channel_messages_status', where);
}

module.exports = messagesStatusRepository;