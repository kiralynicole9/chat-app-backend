const repository = require('./repository')

const reactionsRepository = Object.create(repository);

reactionsRepository.select = async function (data) {
    return this.db.select('reactions', data);
}

reactionsRepository.insert = async function(data){
    return this.db.insert('reactions', data);
}

reactionsRepository.update = async function(data){
    return this.db.update('reactions', data);
}

reactionsRepository.delete = async function(where){
    return this.db.delete('reactions', where);
}

module.exports = reactionsRepository;