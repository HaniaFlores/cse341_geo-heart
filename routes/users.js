const router = require('express').Router();

const controller = require('../controllers/users');
const { createUserRules, updateUserRules, validate } = require('../middlewares/userValidator');

const {isAuthenticated} = require('../middlewares/authentication');

router.get('/', controller.getAll);
router.get('/:username', validate, controller.getByUsername);
router.post('/', isAuthenticated, createUserRules(), validate, controller.createUser);
router.put('/:username', isAuthenticated, updateUserRules(), validate, controller.updateUser);
router.delete('/:username', isAuthenticated, controller.deleteUser);

module.exports = router;