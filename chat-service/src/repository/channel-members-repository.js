const repository = require('./repository')

const channelMembersRepository = Object.create(repository);

channelMembersRepository.select = async function (data) {
    return this.db.select('channel_members', data);
}

channelMembersRepository.insert = async function(data){
    return this.db.insert('channel_members', data);
}

channelMembersRepository.update = async function(data){
    return this.db.update('channel_members', data);
}

channelMembersRepository.delete = async function(where){
    return this.db.delete('channel_members', where);
}

module.exports = channelMembersRepository;