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

module.exports.createAuthor = createAuthor; 