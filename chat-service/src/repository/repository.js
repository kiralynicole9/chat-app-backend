module.exports = {

    db: {},

    select() {
        throw new Error('Select not implemented in Repository');
    },
    update() {
        throw new Error('Update not implemented in Repository');
    },
    delete() {
        throw new Error('Delete not implemented in Repository');
    },
    insert() {
        throw new Error('Insert not implemented in Repository');
    },
    init(database) {
        Object.assign(this.db, database.init());
    }
}