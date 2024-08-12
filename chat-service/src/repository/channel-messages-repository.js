const repository = require('./repository')

const channelMessagesRepository = Object.create(repository);

channelMessagesRepository.select = async function (data) {
    return this.db.select('channel_messages', data);
}

channelMessagesRepository.insert = async function(data){
    return this.db.insert('channel_messages', data);
}

channelMessagesRepository.update = async function(data){
    return this.db.update('channel_messages', data);
}

channelMessagesRepository.delete = async function(where){
    return this.db.delete('channel_messages', where);
}

module.exports = channelMessagesRepository;