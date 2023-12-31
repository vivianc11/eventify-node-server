const express = require('express');
const multer = require('multer');
const User = require('../models/user');

const router = express.Router();
const { createUser, userSignIn, uploadProfilePic, userLogout, addToDo } = require('../controllers/user');
const { validateUserSignUp, userValidation, validateUserSignIn } = require('../middleware/validation/user');
const { isAuth } = require('../middleware/auth');


const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  // checking if the file is an image or not
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload images only', false)
  }
}
const uploads = multer({ storage, fileFilter })

router.post('/create-user', validateUserSignUp, userValidation, createUser);
router.post('/sign-in', validateUserSignIn, userValidation, userSignIn);
router.get('/logout', isAuth, userLogout);

// router.post('/create-post', isAuth, (req, res) => {
//     res.send('Now are you in the secret route')
// })

// in uploads.single, we need to pass in a key name of where we are sending our image file; in this case, it's profile
router.post('/upload-profile', isAuth, uploads.single('profile'), uploadProfilePic)

router.get('/profile', isAuth, (req, res) => {
  if (!req.user) return res.json({ success: false, message: "Unauthorized Access!" });

  res.json({
    success: true,
    profile: {
      fullname: req.user.fullname,
      username: req.user.username,
      email: req.user.email,
      profilePic: req.user.profilePic ? req.user.profilePic : '',
    }
  })
})

router.post('/add-toDo', isAuth, addToDo);

module.exports = router;