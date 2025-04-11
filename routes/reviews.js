const router = require('express').Router();

const reviewsController = require('../controllers/reviews');
const { validateReview, validate } = require('../middlewares/reviewValidator');
const {isAuthenticated} = require('../middlewares/authentication');

router.get('/', reviewsController.getAll);
router.get('/:id', validateReview(), validate, reviewsController.getSingle);
router.post('/', isAuthenticated, validateReview(), validate, reviewsController.createReview);
router.put('/:id', isAuthenticated, validateReview(), validate, reviewsController.updateReview);
router.delete('/:id', isAuthenticated, reviewsController.deleteReview);

module.exports = router;