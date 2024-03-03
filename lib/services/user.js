'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@auxyde/iut-encrypt')

module.exports = class UserService extends Service {
    create(user) {

        user.password = Encrypt.sha1(user.password);
        const { User } = this.server.models();

        return User.query().insertAndFetch(user);
    }

    delete(id) {
        const { User } = this.server.models();
        return User.query().deleteById(id);
    }

    update(id, user) {
        const { User } = this.server.models();
        //Check if user exists
        User.query().findById(id).then
        (user => {
            if (user === undefined) {
                return null;
            }
        })
        return User.query().patchAndFetchById(id, user);
    }

    getAll() {
        const { User } = this.server.models();
        return User.query();
    }

    async login(username, password) {
        const { User } = this.server.models();
        const user = await User.query().findOne({ username });
        if (user && Encrypt.compareSha1(password, user.password)) {
            return user;
        }
        return null;
    }
};
