require('dotenv').config();

const express = require('express');
const app = express();
const PORT = 3000;


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Our DB is connected!!")
    })
    .catch(error => console.log(error.message));

app.get('/', (req, res) => {
    res.send('')
})


app.listen(PORT, () => {
    console.log(`Now listening on port: ${PORT}`)
})