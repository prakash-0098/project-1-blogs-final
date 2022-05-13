const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authorSchema = require('../models/authorModel');
const blogSchema = require('../models/blogsModel');

const handleObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

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
const authorization = async (request, response, next) => {
    const blogId = request.params.blogId;
    if (!handleObjectId(blogId)) {
        return response.status(400).send({
            status: false,
            message: 'only mongodb object id are allowed'
        });
    }
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
    const blogRes = await blogSchema.findById(blogId);
    if (!blogRes) {
        return response.status(404).send({
            status: false,
            message: 'Blog not found'
        });
    }
    if (decodedToken.id != blogRes.authorId) {
        return response.status(403).send({
            status: false,
            message: 'You are unauthorized'
        });
    }
    next();
}

module.exports = {
    auth,
    authorization
}