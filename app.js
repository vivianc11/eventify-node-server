const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('')
})


app.listen(PORT, () => {
    console.log(`Now listening on port: ${PORT}`)
})