const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');

const router = express.Router();
const { createUser, userSignIn } = require('../controllers/user');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middleware/validation/user');
const { isAuth } = require('../middleware/auth');

router.post('/create-user', validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);

// router.post('/create-post', isAuth, (req, res) => {
//     res.send('Now are you in the secret route')
// })

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // checking if the file is an image or not
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else {
        cb('Please upload images only', false)
    }
}
const uploads = multer({ storage, fileFilter })

// in uploads.single, we need to pass in a key name of where we are sending our image file
// in this case, it's profile
router.post('/upload-profile', isAuth, uploads.single('profile'), async (req, res) => {
    const { user } = req;
    if(!user) return res.status(401).json({message: 'No user found, unauthorized access'})

    try{
        const profileBuffer = req.file.buffer;
        const { width, height } = await sharp(profileBuffer).metadata();
        const profilePic = await sharp(profileBuffer).resize(Math.round(width * 0.5), Math.round(height * 0.5)).toBuffer()
    
        await User.findByIdAndUpdate(user._id, {profilePic})
        res.status(201).json({success: true, message: 'Your profile pic is updated'})
        
    } catch (error) {
        res.status(500).json({success: false, message: 'server error, try uploading again after some time'})
        console.log('Error while uploading profile image', error.message)
    }
})

module.exports = router;