const axios = require('axios'); 

const getStates = async (request, response)=>{
    try{
        console.log("Inside call"); 
        const option = {
            method: 'get', 
            url: 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
        }
        const dataRes = await axios(option); 

        console.log("InsideResponse"); 
        response.status(200).send({
            'data': dataRes.data
        }); 
    }catch(error){
        response.status(500).send({
            'Error :': error.message
        }); 
    }
}

const getDistrict = async(request, response)=>{
    try{
        const id = request.params.stateId; 
        const option = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${id}`,
        }
        const dataRes = await axios(option); 
        response.status(200).send({
            'data': dataRes.data
        }); 
    }catch(error){
        response.status(500).send({
            'Error :': error.message
        }); 
    }
}

const getAppointment = async (request, response)=>{
    try{
        const pincode = request.query.pincode; 
        const date = request.query.date; 
        const option = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
        }
        const dataRes = await axios(option); 
        response.status(200).send({
            'data': dataRes.data
        }); 
    }catch(error){
        response.status(500).send({
            'Error :': error.message
        });
    }
}

const getOtp = async(request, response)=>{
    try{
        const mobile = request.body; 
        const option = {
            method: 'post',
            url: 'https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP',
            data: mobile
        }
        const dataRes = await axios(option); 
        response.status(200).send({
            'data': dataRes.data
        }); 
    }catch(error){
        response.status(500).send({
            'Error :': error.message
        });
    }
}

const getAppointmentByDistrict = async (request, response)=>{
    try{
        const districtId = request.query.district_id; 
        const date = request.query.date; 
        const option = {
            method: 'get',
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtId}&date=${date}`
        }
        const dataRes = await axios(option); 
        response.status(200).send({
            'data': dataRes.data
        }); 
    }catch(error){
        response.status(500).send({
            'Error :': error.message
        });
    }
}

module.exports = {
    getStates: getStates,
    getDistrict: getDistrict,
    getAppointment: getAppointment,
    getOtp: getOtp,
    getAppointmentByDistrict: getAppointmentByDistrict
}

