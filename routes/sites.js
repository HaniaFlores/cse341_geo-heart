const router = require('express').Router();

const sitesController = require('../controllers/sites');

router.get('/sites', sitesController.getAll);
router.get('/sites/:id',  sitesController.getById);
router.post('/sites', sitesController.store);
router.put('/sites/:id', sitesController.update);
router.delete('/sites/:id', sitesController.deleteMovie);

module.exports = router;
