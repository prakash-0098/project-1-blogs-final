const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;
const authorSchema = require('../models/authorModel');
const blogSchema = require('../models/blogsModel');

const validateObjectId = (request, response, next) => {
    try {
        const blogId = request.params.blogId;
        // for path prams blogId
        if (blogId != undefined) {
            if (ObjectId.isValid(blogId)) {
                next();
            }
            else {
                return response.status(400).send({
                    'status': false,
                    'msg': 'Only Object Id allowed !'
                });
            }
        }
        else {
            // for request body
            const { authorId } = request.body;
            if (ObjectId.isValid(authorId)) {
                next();
            }
            else {
                return response.status(400).send({
                    'status': false,
                    'msg': 'Only Object Id allowed !'
                });
            }
        }
    } catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}

const checkBlogByPath = async (request, response, next) => {
    try {
        const blogId = request.params.blogId;
        const dataRes = await blogSchema.findById(blogId);
        if (!dataRes) {
            return response.status(400).send({
                'status': false,
                'msg: ': 'Invalid Blog Id'
            });
        }
        if (dataRes.isDeleted) {
            return response.status(404).send({
                'status': false,
                'msg: ': 'Data Not Found !'
            });
        }
        next();
    } catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}

const authorization = async (request, response, next) => {
    try {
        const blogId = request.params.blogId; 
        const token = request.headers['x-api-key'];
        if (!token) {
            return response.status(400).send({
                'status': false,
                'msg': 'Token must be present'
            });
        }

        const decodedToken = jwt.verify(token, '12345');
        if(request.body.authorId){
            if (request.body.authorId != decodedToken.id) {
                return response.status(403).send({
                    'status': false,
                    'msg': 'You are not authorized !'
                });
            }
            next(); 
        }
        else if(Object.keys(request.query).length != 0){
            const dataRes = await blogSchema.find(request.query); 
            if(dataRes.length == 0){
                return response.status(404).send({
                    'status': false,
                    'msg': 'Blogs not found !'
                });
            }
            let foundStatus = false; 
            for(let i = 0; i < dataRes.length; i++){
                if(dataRes[i].authorId != decodedToken.id){
                    foundStatus = false; 
                }
                else{
                    foundStatus = true; 
                    break; 
                }
            }
            if(!foundStatus){
                return response.status(403).send({
                    'status': false,
                    'msg': 'You are not authorized !'
                }); 
            }
            else{
                next(); 
            }
        }
        else if(blogId){
            const userRes = await blogSchema.findById(blogId); 
            if(!userRes){
                return response.status(404).send({
                    'status': false,
                    'msg': 'Blog Not Found !'
                });
            }
            if(userRes.authorId != decodedToken.id){
                return response.status(403).send({
                    'status': false,
                    'msg': 'You are not authorized !'
                }); 
            }
            next();
        } 
        else{
            const getBlogRes = await blogSchema.find({
                'authorId': decodedToken.id
            }); 
            if(getBlogRes.length == 0){
                return response.status(403).send({
                    'status': false,
                    'msg': 'You are not authorized !'
                });
            }
            next(); 
        }

    }
    catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}


module.exports = {
    validateObjectId: validateObjectId,
    checkBlogByPath: checkBlogByPath,
    authorization: authorization
}