const jwt = require('jsonwebtoken'); 
const authorSchema = require('../models/authorModel'); 

const createAuthor = async (request, response)=>{
    try{
        const data = request.body; 
        const dataRes = await authorSchema.create(data); 
        return response.status(201).send({
            'data': dataRes
        }); 
    }catch(error){
        return response.status(500).send({
            'Error: ': error.message
        }); 
    }
}

const login = async (request, response)=>{
    try {
        const data = request.body; 

        const dataRes = await authorSchema.findOne({
            'email': data.email
        }); 
        if(!dataRes){
            return response.status(404).send({
                'status': false,
                'msg': 'Email and Password not found !'
            }); 
        }
        const passwordRes = await authorSchema.findOne(data); 
        if(!passwordRes){
            return response.status(404).send({
                'status': false,
                'msg': 'Email and Password not found !'
            }); 
        }
        const token = jwt.sign({
            id: passwordRes._id
        }, '12345'); 
        return response.send({
            'status': true,
            'msg': token
        }); 

    } catch (error) {
        return response.status(500).send({
            'Error: ': error.message
        }); 
    }
}

module.exports = {
    createAuthor: createAuthor,
    login: login
}
