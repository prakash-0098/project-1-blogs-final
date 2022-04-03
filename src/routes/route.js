const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');
const blogController = require('../controllers/blogController');

const authMiddleware = require('../middlewares/authMiddleware');

router.post('/authors', authorController.createAuthor);
router.post('/blogs', authMiddleware.validateObjectId, authMiddleware.authorization, blogController.createBlog);

router.get('/blogs', authMiddleware.authorization, blogController.fetchBlogs);

router.put('/blogs/:blogId', authMiddleware.validateObjectId, authMiddleware.authorization, blogController.updatedBlog);

router.delete('/blogs/:blogId', authMiddleware.validateObjectId, authMiddleware.authorization, authMiddleware.checkBlogByPath, blogController.deleteBlogById);

router.delete('/blogs', authMiddleware.authorization, blogController.deleteByQuery);

router.post('/login', authorController.login);


module.exports = router;











