const express = require('express'); 
const router = express.Router(); 

const authorController = require('../controllers/authorController'); 
const blogController = require('../controllers/blogController'); 

const authMiddleware = require('../middlewares/authMiddleware'); 

router.post('/authors', authorController.createAuthor); 
router.post('/blogs', authMiddleware.validateObjectId, authMiddleware.checkAuthorId, blogController.createBlog); 

router.get('/blogs', blogController.fetchBlogs); 
//change
router.put('/blogs/:blogId',authMiddleware.validateObjectIdByPath, blogController.updatedBlog); 

router.delete('/blogs/:blogId', authMiddleware.validateObjectIdByPath, authMiddleware.checkBlogByPath, blogController.deleteBlogById); 

router.delete('/blogs', blogController.deleteByQuery); 


module.exports = router; 









// const express = require('express'); 
// const router = express.Router(); 

// const cowinController = require("../controllers/cowinController"); 
// const weatherController = require("../controllers/weatherController"); 
// const memeController = require("../controllers/memeController");

// router.get("/cowin/state", cowinController.getStates); 
// router.get("/cowin/district/:stateId", cowinController.getDistrict); 
// router.get("/cowin/appointment", cowinController.getAppointment); 
// router.post("/cowin/getOtp", cowinController.getOtp); 
// router.get("/cowin/appointmentByDistrict", cowinController.getAppointmentByDistrict); 

// router.get("/weather/getWeatherByPlace", weatherController.getWeatherByPlace);
// router.get("/weather/sortTemperature", weatherController.sortTemperature); 

// router.post("/meme", memeController.modifyMeme); 


// module.exports = router; 

