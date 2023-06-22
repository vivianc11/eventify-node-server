const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.statics.isThisEmailInUse = async function(email) {
    try {
        const foundEmail = await this.findOne({email})
        if(foundEmail) return false;

        return true;
    } catch (error) {
        console.log('error inside isThisEmailInUse');
        return false;
    }
    
userSchema.statics.isThisUsernameInUse = async function(username) {
    try {
        const foundUsername = await this.findOne({username})
        if(foundUsername) return false;

        return true;
    } catch (error) {
        console.log('error inside isThisUsernameInUse')
        return false;
    }
}
};

module.exports = mongoose.model('User', userSchema);