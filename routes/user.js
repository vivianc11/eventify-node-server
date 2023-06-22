const express = require('express');

const router = express.Router();
const { createUser } = require('../controllers/user');
const { validateUserSignUp, userValidation } = require('../middleware/validation/user');

router.post('/create-user', validateUserSignUp, userValidation, createUser)

module.exports = router;