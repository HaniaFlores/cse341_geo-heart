const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/', swaggerUi.serve);

router.get('/', swaggerUi.setup(swaggerDocument), () => {
    // #swagger.ignore = true
});


module.exports = router;