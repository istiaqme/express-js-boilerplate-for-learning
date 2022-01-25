const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

const dbURL = "mongodb://localhost:27017/sunmoon";
mongoose.connect(dbURL, {
    useUnifiedTopology : true,
    useNewUrlParser : true
});

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Mongo DB is Healthy'));

app.listen(3000, () => {
    console.log('Server is running');
})


app.use('/api', require('./controller/api'));


