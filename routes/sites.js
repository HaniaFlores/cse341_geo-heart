const router = require('express').Router();

const { siteValidationRules, validate } = require('../middlewares/siteValidator');
const sitesController = require('../controllers/sites');

const {isAuthenticated} = require('../middlewares/authentication');

router.get('/', sitesController.getAll);
router.get('/:id',  sitesController.getById);
router.post('/', isAuthenticated, siteValidationRules(), validate, sitesController.store);
router.put('/:id', isAuthenticated, siteValidationRules(), validate, sitesController.update);
router.delete('/:id', isAuthenticated, sitesController.deleteSite);

module.exports = router;
