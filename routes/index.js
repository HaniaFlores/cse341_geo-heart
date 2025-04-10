const router = require('express').Router();

router.get('/', (req, res) => {
   // #swagger.ignore = true
   res.send(req.session.user !== undefined
       ? `Logged in as ${req.session.user.name} (${req.session.user.username})`
       : 'Logged out');
});

router.use('/api-docs', require('./api-docs'));
router.use('/sites', require('./sites'));
router.use('/categories', require('./categories'));
router.use('/auth', require('./auth'));

module.exports = router;
