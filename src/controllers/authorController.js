const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const authorSchema = require('../models/authorModel'); 

const createAuthor = async (request, response)=>{
    try{
        const data = request.body; 
        bcrypt.hash(data.password, 10).then((encryptedPassword)=>{
            data.password = encryptedPassword; 
            authorSchema.create(data).then((dataRes)=>{
                return response.status(201).send({
                    'data': dataRes
                }); 
            }).catch((error)=>{
                if(error.code == 11000){ //conflict or Duplicate data
                    return response.status(409).send({
                        'status': false,
                        'msg: ': error.message
                    });
                }
                const key = Object.keys(error['errors']); // handle required validation
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
            }); 
            
        }).catch((error)=>{
            return response.status(500).send({
                'status': false,
                'msg': error.message
            }); 
        }); 
    }catch(error){
        return response.status(500).send({
            'status': false,
            'msg': error.message
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
                'msg': 'Email and Password not found !' // wrong email id
            }); 
        }
        bcrypt.compare(data.password, dataRes.password).then((result)=>{
            if(!result){
                return response.status(404).send({
                    'status': false,
                    'msg': 'Email and Password not found !' // wrong password
                }); 
            }
            const token = jwt.sign({
                id: dataRes._id
            }, '12345'); 
            return response.send({
                'status': true,
                'msg': token
            }); 
        }).catch((error)=>{
            return response.status(500).send({
                'status': false,
                'msg': error.message
            }); 
        });  
    } catch (error) {
        return response.status(500).send({
            'status': false,
            'msg': error.message
        }); 
    }
}

module.exports = {
    createAuthor: createAuthor,
    login: login
}
