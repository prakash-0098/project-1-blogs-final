const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'The title field is required'],
        trim: true
    },
    body: {
        type: String,
        required: [true, 'The body field is required'],
        trim: true
    },
    authorId: {
        type: ObjectId,
        ref: 'Author',
        required: [true, 'The authorId field is required'],
        trim: true
    },
    tags: [String],
    category: {
        type: String,
        required: [true, 'The category field is required'],
        trim: true
    },
    subcategory: [String],
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: Date,
    isPublished: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema); //db collection name will be in blogs



