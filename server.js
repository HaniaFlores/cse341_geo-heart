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
    .use('/', require('./routes'))
    .use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

mongodb.initDb()
    .then(() => {
        console.log('Database connection estabilished.');
    })
    .catch((err) => {
        console.error('Failed to connect to database:', err);
        process.exit(1);
    });

if (require.main === module) {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
}


module.exports = app;
