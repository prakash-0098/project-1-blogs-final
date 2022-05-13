const mongoose = require('mongoose');
const blogSchema = require('../models/blogsModel');
const jwt = require('jsonwebtoken');

const handleObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
}

const createBlog = async (request, response) => {
    try {
        const data = request.body;
        const key = Object.keys(data);
        if (key.length == 0) {
            return response.status(400).send({
                status: false,
                message: 'Body should not be an empty'
            });
        }

        if (data.authorId) {
            if (!handleObjectId(data.authorId)) {
                return response.status(400).send({
                    status: false,
                    message: 'Only mongodb object id are allowed'
                });
            }
            const decodedToken = jwt.verify(request.headers['x-api-key'], '12345');
            if (decodedToken.id != data.authorId) {
                return response.status(400).send({
                    status: false,
                    message: 'authorId does not match with token'
                });
            }
            if (request.body.isPublished != undefined) {
                data.publishedAt = new Date();
            }
            const dataRes = await blogSchema.create(data);
            return response.status(201).send({
                status: true,
                message: 'Blog created success',
                data: dataRes
            });
        }
        else {
            return response.status(400).send({
                status: false,
                message: 'AuthorId field is required'
            });
        }
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

const fetchBlogs = async (request, response) => {
    try {
        if (Object.keys(request.query).length != 0) {
            request.query.isDeleted = false;
            request.query.isPublished = true;

            const dataRes = await blogSchema.find(request.query);
            if (dataRes.length == 0) {
                return response.status(404).send({
                    status: false,
                    message: 'Blog Not Found !'
                });
            }
            return response.status(200).send({
                status: true,
                message: 'success',
                count: dataRes.length,
                data: dataRes
            });
        }
        else {
            const dataRes = await blogSchema.find({
                isDeleted: false,
                isPublished: true
            });
            if (dataRes.length == 0) {
                return response.status(404).send({
                    status: false,
                    message: 'Blog Not Found !'
                });
            }
            return response.status(200).send({
                status: true,
                message: 'success',
                count: dataRes.length,
                data: dataRes
            });
        }
    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const updatedBlog = async (request, response) => {
    try {
        const blogId = request.params.blogId;
        const data = request.body;
        const keys = Object.keys(data);
        if (keys.length == 0) {
            return response.status(200).send({
                status: true,
                message: 'No changes'
            });
        }

        if (!handleObjectId(blogId)) {
            return response.status(400).send({
                status: false,
                message: 'Only mongodb object id are allowed'
            });
        }
        const blogRes = await blogSchema.findOne({
            _id: blogId,
            isDeleted: false
        });
        if (!blogRes) {
            return response.status(404).send({
                status: false,
                message: 'Blog Not Found !'
            });
        }
        data.publishedAt = new Date();
        data.isPublished = true
        const dataRes = await blogSchema.findByIdAndUpdate(blogId, data, {
            new: true
        });
        return response.status(200).send({
            status: true,
            message: `${keys.length} field updated successfully`,
            data: dataRes
        });
    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const deleteBlogById = async (request, response) => {
    try {
        const blogId = request.params.blogId;

        if (!handleObjectId(blogId)) {
            return response.status(400).send({
                status: false,
                message: 'Only mongodb object id are allowed'
            });
        }
        const blogRes = await blogSchema.findOne({
            _id: blogId,
            isDeleted: false
        });
        if (!blogRes) {
            return response.status(404).send({
                status: false,
                message: 'Blog Not Found !'
            });
        }
        const dataRes = await blogSchema.findByIdAndUpdate(blogId, {
            isDeleted: true,
            deletedAt: new Date()
        });
        return response.status(200).send({
            status: true,
            message: 'Blog deleted successfully !'
        });
    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

const deleteByQuery = async (request, response) => {
    try {
        const data = request.query;
        const keys = Object.keys(data);

        if (keys.length == 0) {
            return response.status(400).send({
                status: true,
                message: 'Please provide a query data'
            });
        }
        const decodedToken = jwt.verify(request.headers['x-api-key'], '12345');
        data.authorId = decodedToken.id;
        data.isDeleted = false;

        const fetchData = await blogSchema.find(data);
        if (fetchData.length == 0) {
            return response.status(404).send({
                status: false,
                message: 'Blog not found !'
            });
        }
        const dataRes = await blogSchema.updateMany(data, {
            isDeleted: true,
            deletedAt: new Date()
        });
        return response.status(200).send({
            status: true,
            message: `${dataRes.modifiedCount} Blog deleted successfully !`,
        });

    } catch (error) {
        return response.status(500).send({
            status: false,
            message: error.message
        });
    }
}

module.exports = {
    createBlog,
    fetchBlogs,
    updatedBlog,
    deleteBlogById,
    deleteByQuery
}