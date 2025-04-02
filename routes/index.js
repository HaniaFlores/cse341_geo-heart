const router = require('express').Router();

router.get('/', (req, res) => {
   // #swagger.ignore = true
   res.send('Hello World');
});

router.use('/api-docs', require('./api-docs'));

router.use(require('./sites'));
module.exports = router;
