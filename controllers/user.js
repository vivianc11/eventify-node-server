const User = require('../models/user');

exports.createUser = async (req, res) => {
    const { fullname, username, email, password} = req.body
    const isNewUser = await User.isThisEmailInUse(email);
    if (!isNewUser){
        return res.json({
            success: false,
            message: "This email already exists, try signing in!"
        })
    }
    const isNewUsername = await User.isThisUsernameInUse(username);
    if(!isNewUsername){
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
    res.json(user);
}

exports.userSignIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(!user) return res.json({success: false, message: 'User not found with email'});

    const isMatch = await user.comparePassword(password);

    if(!isMatch) return res.json({success: false, message: 'Email or password does not match!'})

    res.json({success: true, user})
    
}