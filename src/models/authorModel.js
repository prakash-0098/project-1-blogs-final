const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, 'The fname field is required'],
        trim: true
    },
    lname: {
        type: String,
        required: [true, 'The lname field is required'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'The title field is required'],
        enum: {
            values: ['Mr', 'Mrs', 'Miss'],
            message: "Enter the valid title ie., ['Mr', 'Mrs', 'Miss']"
        },
        trim: true
    },
    email: {
        type: String,
        required: [true, 'The email field is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Enter a valid Email Id'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'The password field is required'],
        trim: true
    }
}, {
    timestamps: true
});
uniqueValidator.defaults.message = 'The {PATH} is already registered !'
authorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Author', authorSchema); //db collection name will be in authors






