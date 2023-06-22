const { check } = require('express-validator');

exports.validateUserSignUp = [
    check('fullname')
    .trim()
    .notEmpty()
    .isLength({min: 3})
    .withMessage('Name must have atleast 3 characters'),

    check('username')
    .trim()
    .notEmpty()
    .isLength({min: 3})
    .withMessage('Username must have atleast 3 characters'),

    check('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid Email'),

    check('password')
    .trim()
    .notEmpty()
    .isLength({min: 8})
    .withMessage('Password must have atleast 8 characters'),

    check('confirmPassword')
    .trim()
    .notEmpty()
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords must match!')
        }
        return true;
    })
]