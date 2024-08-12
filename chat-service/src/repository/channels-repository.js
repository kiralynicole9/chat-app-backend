const repository = require('./repository')

const channelsRepository = Object.create(repository);

channelsRepository.select = async function (data) {
    return this.db.select('channels', data);
}

channelsRepository.insert = async function(data){
    return this.db.insert('channels', data);
}

channelsRepository.update = async function(data){
    return this.db.update('channels', data);
}

channelsRepository.delete = async function(where){
    return this.db.delete('channels', where);
}

module.exports = channelsRepository;