const jwt = require('jsonwebtoken');
const authorSchema = require('../models/authorModel');

const auth = async (request, response, next) => {
    try {
        const token = request.headers['x-api-key'];
        if (!token) {
            return response.status(400).send({
                status: false,
                message: 'Token must be present'
            });
        }
        let decodedToken = "";
        jwt.verify(token, '12345', (error, result) => {
            if (error) {
                return response.status(401).send({
                    status: false,
                    message: error.message
                });
            }
            decodedToken = result;
        });
        if (decodedToken != undefined) {
            const authorRes = await authorSchema.findById(decodedToken.id);
            if (!authorRes) {
                return response.status(401).send({
                    status: false,
                    message: 'You are unauthenticated'
                });
            }
            next();
        }

    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const authorization = (request, response, id) => {
    return new Promise((resolve, reject) => {
        const token = request.headers['x-api-key'];
        let decodedToken = "";
        jwt.verify(token, '12345', (error, result) => {
            if (error) {
                return response.status(401).send({
                    status: false,
                    message: error.message
                });
            }
            decodedToken = result;
        });
        if (decodedToken.id != id) {
            return response.status(403).send({
                status: false,
                message: 'You are unauthorized'
            });
        }
        resolve(true)
    });
}

module.exports = {
    auth,
    authorization
}