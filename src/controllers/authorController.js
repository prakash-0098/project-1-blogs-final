const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authorSchema = require('../models/authorModel');

const createAuthor = async (request, response) => {
    try {
        const data = request.body;
        const key = Object.keys(data);
        if (key.length == 0) {
            return response.status(400).send({
                status: false,
                message: 'Body should not be an empty'
            });
        }
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, 10);
        }
        const insertRes = await authorSchema.create(data);
        return response.status(201).send({
            status: true,
            message: 'success',
            data: insertRes
        });

    } catch (error) {
        if (error['errors'] != null) {
            const key = Object.keys(error['errors']);
            if (key.length > 0) {
                return response.status(400).send({
                    status: false,
                    message: error['errors'][key[0]]['message']
                });
            }
        }
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const login = async (request, response) => {
    try {
        const data = request.body;
        const keys = Object.keys(data);
        if (keys.length == 0) {
            return response.status(400).send({
                status: false,
                message: 'Body should not be an empty'
            });
        }
        const requiredParams = ['email', 'password'];

        for (let i = 0; i < requiredParams.length; i++) {
            if (!data[requiredParams[i]] || !data[requiredParams[i]].trim()) {
                return response.status(400).send({
                    status: false,
                    message: `${requiredParams[i]} field is required`
                });
            }
        }
        if (data.email) {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!regex.test(data.email)) {
                return response.status(400).send({
                    status: false,
                    message: `${data.email} is not a valid email`
                });
            }
        }
        const dataRes = await authorSchema.findOne({
            email: data.email
        });
        if (!dataRes) {
            return response.status(401).send({
                status: false,
                message: 'Invalid email id' // wrong email id
            });
        }
        bcrypt.compare(data.password, dataRes.password).then((result) => {
            if (!result) {
                return response.status(401).send({
                    status: false,
                    message: 'Invalid email and password' // wrong password
                });
            }
            const token = jwt.sign({
                id: dataRes._id
            }, '12345');
            return response.send({
                status: true,
                message: token
            });
        }).catch((error) => {
            return response.status(500).send({
                status: false,
                message: error.message
            });
        });
    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

module.exports = {
    createAuthor: createAuthor,
    login: login
}
