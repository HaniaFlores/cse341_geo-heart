const { route } = require('./reviews');

const router = require('express').Router();

router.get('/', (req, res) => {
   // #swagger.ignore = true
   res.send(req.session.user !== undefined
       ? `Logged in as ${req.session.user.displayName} (${req.session.user.username})`
       : 'Logged out');
});

router.use('/api-docs', require('./api-docs'));
router.use('/sites', require('./sites'));
router.use('/categories', require('./categories'));
router.use('/auth', require('./auth'));
router.use('/reviews', require('./reviews'));
router.use('/users', require('./users'));

module.exports = router;
