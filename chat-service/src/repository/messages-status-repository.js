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

messagesStatusRepository.updateWithCompositeKey = async function(keys, data){
    return this.db.updateWithCompositeKey('channel_messages_status', keys, data);
}

messagesStatusRepository.countMessages = async function(userId){
    const results = await this.db.query`
    SELECT CAST(COUNT(channel_messages_status.message_id) as INTEGER) as messages, channel_messages.channel_id 
    FROM channel_messages_status 
    LEFT JOIN channel_messages ON
    channel_messages_status.message_id = channel_messages.message_id
    WHERE channel_messages_status.user_id = ${userId}
    AND (channel_messages_status.has_been_read is NULL
    OR channel_messages_status.has_been_read = 0)
    GROUP BY channel_messages.channel_id;
    `
    return results;
}

messagesStatusRepository.delete = async function(where){
    return this.db.delete('channel_messages_status', where);
}

module.exports = messagesStatusRepository;