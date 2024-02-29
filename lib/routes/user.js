'use strict';

const Joi = require('joi');


const postUser = {
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.create(request.payload);
    }
};

const deleteUser = {
    method: 'delete',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('User id')
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        // return '' if succeeded, 404 if not found
        return await userService.delete(request.params.id) ? '' : h.response().code(404);
    }
};

const getUsers = {
    method: 'get',
    path: '/user',
    options: {
        tags: ['api']
    },
    handler: async (request, h) => {

        const { User } = request.models();

        const users = await User.query();

        return users;
    }
};


module.exports = [
    postUser,
    deleteUser,
    getUsers
];
