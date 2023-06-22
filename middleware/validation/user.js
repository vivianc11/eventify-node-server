const { check, validationResult } = require('express-validator');

exports.validateUserSignUp = [
    check('fullname')
    .trim()
    .notEmpty()
    .withMessage('Full name is required!')
    .isLength({min: 3})
    .withMessage('Name must have atleast 3 characters'),

    check('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required!')
    .isLength({min: 3})
    .withMessage('Username must have atleast 3 characters'),

    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email'),

    check('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({min: 8})
    .withMessage('Password must have atleast 8 characters'),

    check('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Please confirm password')
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords must match!')
        }
        return true;
    })
]

exports.userValidation = (req, res, next) => {
    const result = validationResult(req).array();
    // if there is no errors
    if(!result.length) return next();

    const error = result[0].msg;
    res.json({success: false, message: error})
}