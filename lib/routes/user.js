'use strict';

const Joi = require('joi');


const postUser = {
    method: 'post',
    path: '/user',
    options: {
        tags: ['api'],
        auth: false,
        validate: {
            payload: Joi.object({
                firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                username: Joi.string().required().min(8).example('Xx_D4rK_John_xX').description('Username of the user'),
                password: Joi.string().required(),
                mail: Joi.string().required().email().example('john@email.com')
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
        auth: {
            scope: ['admin']
        },
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
        tags: ['api'],
        auth : {
            scope: ['admin', 'user']
        }
    },
    handler: async (request, h) => {
        const {userService} = request.services();

        return await userService.getAll();
    }
};

const patchUser = {
    // Edit user infos by id, only the fields that are present in the payload will be updated
    // Password and mail are not editable for now
    method: 'patch',
    path: '/user/{id}',
    options: {
        tags: ['api'],
        auth: {
            scope: ['admin']
        },
        validate: {
            params: Joi.object({
                id: Joi.number().integer().required().description('User id')
            }),
            payload: Joi.object({
                username: Joi.string().min(3).example('Xx_D4rK_John_xX').description('Username of the user'),
                firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
                lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            }),
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();

        return await userService.update(request.params.id, request.payload);
    }
};

const loginUser = {
    method: 'post',
    path: '/user/login',
    options: {
        tags: ['api'],
        auth: false,
        validate: {
            payload: Joi.object({
                username: Joi.string().required().min(8).example('Xx_D4rK_John_xX').description('Username of the user'),
                password: Joi.string().required()
            })
        }
    },
    handler: async (request, h) => {

        const { userService } = request.services();
        const { username, password } = request.payload;

        const jwt = await userService.login(username, password);

        return jwt ? {login: 'successful', jwt: jwt} : h.response().code(401);
    }
};




module.exports = [
    loginUser,
    patchUser,
    postUser,
    deleteUser,
    getUsers
];
