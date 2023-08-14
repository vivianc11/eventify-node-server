const express = require('express');
const multer = require('multer');
const User = require('../models/user');

const router = express.Router();
const { createUser, userSignIn, uploadProfilePic } = require('../controllers/user');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middleware/validation/user');
const { isAuth } = require('../middleware/auth');


const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
    // checking if the file is an image or not
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else {
        cb('Please upload images only', false)
    }
}
const uploads = multer({ storage, fileFilter })

router.post('/create-user', validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);

// router.post('/create-post', isAuth, (req, res) => {
//     res.send('Now are you in the secret route')
// })

// in uploads.single, we need to pass in a key name of where we are sending our image file
// in this case, it's profile
router.post('/upload-profile', isAuth, uploads.single('profile'), uploadProfilePic)

module.exports = router;