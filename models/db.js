const mongoose = require('mongoose');

module.exports = mongoose.connect(process.env.MONGO_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Our DB is connected!!")
    })
    .catch(error => console.log(error.message));