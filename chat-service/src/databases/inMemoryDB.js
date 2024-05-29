const { init, select } = require("./postgres")

const inMemoryDb = {
    users : [],
    messages: []
}
module.exports = {
    init() {
        this.db = inMemoryDb;
        return this;
    },
    async select(table, where) {
        return this.db[table];
    },

    async insert(table, values) {
        this.db[table].push(values);
    },

    async delete(table, where) {
        this.db[table] = this.db[table].filter(where);
    },

    async update(table, where) {
        this.db[table].forEach((row) => {
            if (where(row)) {
                fields.forEach((field) => {
                    row[field] = fields[field];
                })
            }
        })
    }
}