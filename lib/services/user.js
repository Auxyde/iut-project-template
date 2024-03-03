'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@auxyde/iut-encrypt')
const Jwt = require('@hapi/jwt');

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
            const token = Jwt.token.generate(
                {
                    aud: 'urn:audience:iut',
                    iss: 'urn:issuer:iut',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email,
                    scope: user.scope
                },
                {
                    key: 'random_string', // La clé qui est définit dans lib/auth/strategies/jwt.js
                    algorithm: 'HS512'
                },
                {
                    ttlSec: 14400 // 4 hours
                }
            );
            return token;
        }
        return null;
    }
};
