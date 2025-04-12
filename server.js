const express = require('express');
const bodyParser = require('body-parser')
const mongodb = require('./config/database.js');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

require('./config/passport')(passport);

const app = express();

const port = process.env.PORT || 3000;
app
    .use(bodyParser.json())
    .use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        next();
    })
    .use(cors({methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH']}))
    .use(cors({origin: '*'}))
    .use('/', require('./routes'));

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Database is listening and node Running on port ${port}`)
        });
    }
});

module.exports = app;