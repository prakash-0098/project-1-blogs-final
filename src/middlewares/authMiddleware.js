const mongoose = require('mongoose'); 
const ObjectId = mongoose.Types.ObjectId; 
const authorSchema = require('../models/authorModel'); 
const blogSchema = require('../models/blogsModel'); 

const validateObjectId = (request, response, next)=>{
    try {
        const { authorId } = request.body; 
        if(ObjectId.isValid(authorId)){
            next(); 
        } 
        else{
            return response.status(400).send({
                'Error: ': 'Only Object Id allowed !'
            }); 
        }
    } catch (error) {
        return response.status(500).send({
            'Error: ': error.message
        });
    }
}

const checkAuthorId = async (request, response, next)=>{
    try{
        const { authorId } = request.body; 
        const dataRes = await authorSchema.findById(authorId); 
        if(!dataRes){
            return response.status(400).send({
                'Error: ': 'Invalid author Id'
            }); 
        }
        next();  
    }catch(error){
        return response.status(500).send({
            'Error: ': error.message
        }); 
    }
}

const validateObjectIdByPath = (request, response, next)=>{
    try {
        const blogId = request.params.blogId; 
        if(ObjectId.isValid(blogId)){
            next(); 
        } 
        else{
            return response.status(400).send({
                'Error: ': 'Only Object Id allowed !'
            }); 
        }
    } catch (error) {
        return response.status(500).send({
            'Error: ': error.message
        });
    }
}

const checkBlogByPath = async (request, response, next)=>{
    try{
        const blogId = request.params.blogId; 
        const dataRes = await blogSchema.findById(blogId); 
        if(!dataRes){
            return response.status(400).send({
                'status': false,
                'msg: ': 'Invalid Blog Id'
            }); 
        }
        if(dataRes.isDeleted){
            return response.status(404).send({
                'status': false,
                'msg: ': 'Data Not Found !'
            }); 
        }
        next(); 
    }catch(error){
        return response.status(500).send({
            'Error: ': error.message
        }); 
    }
}


module.exports = {
    checkAuthorId: checkAuthorId,
    validateObjectId: validateObjectId,
    validateObjectIdByPath: validateObjectIdByPath, //change
    checkBlogByPath: checkBlogByPath
}