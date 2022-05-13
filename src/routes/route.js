const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController');
const blogController = require('../controllers/blogController');

const middleware = require('../middlewares/authMiddleware');

router.post('/authors', authorController.createAuthor);
router.post('/login', authorController.login);

router.post('/blogs', middleware.auth, blogController.createBlog);
router.get('/blogs', middleware.auth, blogController.fetchBlogs);
router.put('/blogs/:blogId', middleware.auth, middleware.authorization, blogController.updatedBlog);
router.delete('/blogs/:blogId', middleware.auth, middleware.authorization, blogController.deleteBlogById);
router.delete('/blogs', middleware.auth, blogController.deleteByQuery);



module.exports = router;











