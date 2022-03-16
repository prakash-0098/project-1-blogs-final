const blogSchema = require('../models/blogsModel');
const jwt = require('jsonwebtoken'); 

const createBlog = async (request, response) => {
    try {
        const data = request.body;
        if (request.body.isPublished != undefined) {
            data.publishedAt = new Date();
        }
        const dataRes = await blogSchema.create(data);
        return response.status(201).send({
            'status': true,
            'data': dataRes
        });
    } catch (error) {
        const key = Object.keys(error['errors']);
        for(let i = 0; i < key.length; i++){
            if(error['errors'][key[i]]['kind'] == "required"){
                return response.status(400).send({
                    'status': false,
                    'msg: ': error.message
                }); 
            }
        }
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}

const fetchBlogs = async (request, response) => {
    try {
        if (Object.keys(request.query).length != 0) {
            request.query.isDeleted = false;
            request.query.isPublished = true;
            const dataRes = await blogSchema.find(request.query);
            if (dataRes.length == 0) {
                return response.status(404).send({
                    'status': false,
                    'msg': 'Data Not Found !'
                });
            }
            return response.status(200).send({
                'status': true,
                'data': dataRes
            });
        }
        else {
            const dataRes = await blogSchema.find({
                isDeleted: false,
                isPublished: true
            });
            if (dataRes.length == 0) {
                return response.status(404).send({
                    'status': false,
                    'msg': 'Data Not Found !'
                });
            }
            return response.status(200).send({
                'status': true,
                'data': dataRes
            });
        }
    } catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}

const updatedBlog = async (request, response) => {
    try {
        const blogId = request.params.blogId;
        const data = request.body;
        const fetchData = await blogSchema.findById(blogId);
        if (fetchData.isDeleted) {
            return response.status(404).send({
                'status': false,
                'msg': 'Blog Not Found !'
            });
        }
        data.publishedAt = new Date();
        data.isPublished = true
        const dataRes = await blogSchema.findByIdAndUpdate(blogId, data, {
            new: true
        });
        return response.status(200).send({
            'status': true,
            'msg': dataRes
        });
    } catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}

const deleteBlogById = async (request, response)=>{
    try{
        const blogId = request.params.blogId; 
        const dataRes = await blogSchema.findByIdAndUpdate(blogId, {
            isDeleted: true,
            deletedAt: new Date()
        }); 
        return response.status(200).send({
            'status': true,
            'msg': 'Blog deleted successfully !'
        }); 
    }catch(error){
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}

const deleteByQuery = async (request, response)=>{
    try {
        const data = request.query; 
        const fetchData = await blogSchema.find(data);
        for(let i = 0; i < fetchData.length; i++){
            if(fetchData[i].isDeleted){
                return response.status(404).send({
                    'status': false,
                    'msg': 'Blog not found !'
                }); 
            }
        }
        const decodedToken = jwt.verify(request.headers['x-api-key'], '12345'); 
        data.authorId = decodedToken.id; 
        const dataRes = await blogSchema.updateMany(data, { 
            isDeleted: true,
            deletedAt: new Date()
        }); 
        return response.status(200).send({
            'status': true,
            'msg': 'Blog deleted successfully !'
        }); 
    } catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        });
    }
}



module.exports = {
    createBlog: createBlog,
    fetchBlogs: fetchBlogs,
    updatedBlog: updatedBlog,
    deleteBlogById: deleteBlogById,
    deleteByQuery: deleteByQuery
}