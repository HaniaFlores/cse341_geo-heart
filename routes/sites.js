const router = require('express').Router();

const { siteValidationRules, validate } = require('../middlewares/siteValidator');
const sitesController = require('../controllers/sites');

router.get('/', sitesController.getAll);
router.get('/:id',  sitesController.getById);
router.post('/', siteValidationRules(), validate, sitesController.store);
router.put('/:id', siteValidationRules(), validate, sitesController.update);
router.delete('/:id', sitesController.deleteSite);

module.exports = router;
