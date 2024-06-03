const notificationRepository = require("./notification-repository");
const repository = require("./repository");

const messageRepository = Object.create(repository);
messageRepository.select = async function (where) {
    return await this.db.select('messages', where);
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

messageRepository.createMessage = async (message) => {

    const savedMessage = await messageRepository.insert({
        from_users: parseFloat(message.from_users),
        to_users: parseFloat(message.to_users),
        message: message.text
    });

    console.log(savedMessage, "aaa");

    const notification = await notificationRepository.insert({
        id_message: savedMessage.id,
        from_user: message.from_users,
        to_user: message.to_users
    })

    return savedMessage;
}

module.exports = messageRepository;

