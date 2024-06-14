const repository = require("./repository");

const userRepository = Object.create(repository);

userRepository.select = async function (data) {
    return this.db.select('users', data);
}

userRepository.update = async function (fields) {
    return this.db.update('users', fields);
}

userRepository.insert = async function (data) {
    return this.db.insert('users', data);
}

userRepository.delete = async function (where) {
    return this.db.delete('users', where);
}


module.exports = userRepository;