'use strict';

module.exports = {
    method: 'get',
    path: '/user',
    options: {
        tags: ['api'],
    },
    handler: async (request, h) => {

        return { firstName: 'John', lastName: 'Doe'};
    }
};
