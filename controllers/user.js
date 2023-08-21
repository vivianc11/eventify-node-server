const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cloudinary = require('../helper/imageUpload');


exports.createUser = async (req, res) => {
  const { fullname, username, email, password } = req.body
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser) {
    return res.json({
      success: false,
      message: "This email already exists, try signing in!"
    })
  }
  const isNewUsername = await User.isThisUsernameInUse(username);
  if (!isNewUsername) {
    return res.json({
      sucess: false,
      message: "This username already exists, try again"
    })
  }
  const user = await User({
    fullname,
    username,
    email,
    password,
  })
  await user.save();
  res.json({ success: true, user });
}

exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: 'User not found with email' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.json({ success: false, message: 'Email or password does not match!' });

  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // if there are any existing tokens in the db, then assign it to oldTokens otherwise, assign oldToken to be empty
  let oldTokens = user.tokens || [];
  // if oldToken is not empty, then check if it's expired by filtering signedAt from the token and subtracting the date stored in the database and current date
  if (oldTokens.length) {
    oldTokens = oldTokens.filter(token => {
      const timeDiff = Date.now() - parseInt(token.signedAt) / 1000
      // 1d = 86400secs
      // if this is true, it means the token is NOT expired
      if (timeDiff < 86400) {
        return token
      }
    })
  }

  await User.findByIdAndUpdate(user._id, { tokens: [...oldTokens, { token: jwtToken, signedAt: Date.now().toString() }] })

  res.json({ success: true, user, jwtToken })

}

exports.uploadProfilePic = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).json({ message: 'No user found, unauthorized access' })


  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${user._id}_profile`,
      // width: 500,
      // height: 500,
      // crop: 'fill'
    })

    await User.findByIdAndUpdate(user._id, { profilePic: result.url })
    res.status(201).json({ profilePic: result.url, success: true, message: 'Your profile pic is updated' })

  } catch (error) {
    res.status(500).json({ success: false, message: 'server error, try uploading again after some time' })
    console.log('Error while uploading profile image', error.message)
  }
}

exports.userLogout = async (req, res) => {
  if(req.headers && req.headers.authorization){
    const token = req.headers.authorization.split(' ')[1];
    if(!token) {
      return res.status(401).json({sucess: false, message: 'Authorization failed!'})
    }

    // since user is logging out, want to remove the tokens by setting the tokens to an empty array
    await User.findByIdAndUpdate(req.user._id, {tokens: []})

    res.json({sucess: true, message: 'You are logged out!'})
  }
}