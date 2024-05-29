const repository = require("./repository");

const messageRepository = Object.create(repository);
messageRepository.select = async function (where) {
    return this.db.select('messages', where);
}

messageRepository.update = async function (fields, where) {
    return this.db.update('messages', fields, where);
}

messageRepository.insert = async function (values) {
    return this.db.insert('messages', values);
}

messageRepository.delete = async function (where) {
    return this.db.delete('messages', where);
}

module.exports = messageRepository;