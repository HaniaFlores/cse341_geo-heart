const router = require('express').Router();

const categoriesController = require('../controllers/categories');
const { categoryValidationRules, validate } = require('../middlewares/categoryValidator');

router.get('/', categoriesController.getAll);
router.get('/:name', categoryValidationRules(), validate, categoriesController.getByName);
router.post('/', categoryValidationRules(), validate, categoriesController.createCategory);
router.put('/:name', categoryValidationRules(), validate, categoriesController.updateCategory);
router.delete('/:name', categoriesController.deleteCategory);

module.exports = router;