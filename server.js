require('dotenv').config();
require('./models/db');
const userRouter = require('./routes/user');


const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(userRouter);


app.get('/', (req, res) => {
    res.json({success: true, message: "Connected to backend!"})
})

app.listen(PORT, () => {
    console.log(`Now listening: http://localhost:${PORT}/`)
})