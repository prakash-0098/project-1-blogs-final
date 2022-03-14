const express = require('express'); 
const router = express.Router(); 

const authorController = require('../controllers/authorController'); 
const blogController = require('../controllers/blogController'); 

const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/authors', authorController.createAuthor); 
router.post('/blogs', authMiddleware.validateObjectId, authMiddleware.checkAuthorId, blogController.createBlog); 

router.get('/blogs', blogController.fetchBlogs); 

router.put('/blogs/:blogId',authMiddleware.validateObjectId, blogController.updatedBlog); 

router.delete('/blogs/:blogId', authMiddleware.validateObjectId, authMiddleware.checkBlogByPath, blogController.deleteBlogById); 

router.delete('/blogs', blogController.deleteByQuery); 


module.exports = router; 











