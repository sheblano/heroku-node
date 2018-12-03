const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

// Routes
let UserRoute = require('./routes/user-route');

// Application Environment
let environment = 'LOCAL';
let port = process.env.PORT || config[environment].SERVER_PORT;

// initialize express app
const app = express();


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// middlware for cors origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Origin, Accept, Authorization, X-Requested-With');
    if (req.method === 'Options') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// connect to the database
mongoose.connect('mongodb://atlasAdmin:' + config[environment].MONGO_ATLAS_PW + '@cluster0-shard-00-00-lzlp6.mongodb.net:27017,cluster0-shard-00-01-lzlp6.mongodb.net:27017,cluster0-shard-00-02-lzlp6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true', {
    useNewUrlParser: true
});

UserRoute(app);

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});