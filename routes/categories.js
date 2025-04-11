const router = require('express').Router();

const categoriesController = require('../controllers/categories');
const { categoryValidationRules, validate } = require('../middlewares/categoryValidator');

const {isAuthenticated} = require('../middlewares/authentication');

router.get('/', categoriesController.getAll);
router.get('/:name', categoryValidationRules(), validate, categoriesController.getByName);
router.post('/', isAuthenticated, categoryValidationRules(), validate, categoriesController.createCategory);
router.put('/:name', isAuthenticated, categoryValidationRules(), validate, categoriesController.updateCategory);
router.delete('/:name', isAuthenticated, categoriesController.deleteCategory);

module.exports = router;