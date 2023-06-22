const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

// running this hash password function before saving user to database
userSchema.pre('save', function(next) {
    if(this.isNew || this.isModified('password')){
        const saltRounds = 10;
        bcrypt.hash(this.password, saltRounds, (err, hash) => {
            if(err) return next(err);

            this.password = hash;
            next();
        })
    }
})

userSchema.methods.comparePassword = async function (password) {
    if(!password) throw new Error('Password is missing, can not compare!')

    try{
        const result = await bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        console.log('Error while comparing password!', error.message);
    }
}

userSchema.statics.isThisEmailInUse = async function(email) {
    try {
        const foundEmail = await this.findOne({email})
        if(foundEmail) return false;

        return true;
    } catch (error) {
        console.log('error inside isThisEmailInUse');
        return false;
    }
};

userSchema.statics.isThisUsernameInUse =  async function(username) {
    try {
        const foundUsername = await this.findOne({username})
        if(foundUsername) return false;

        return true;
    } catch (error) {
        console.log('error inside isThisUsernameInUse')
        return false;
    }
};

module.exports = mongoose.model('User', userSchema);