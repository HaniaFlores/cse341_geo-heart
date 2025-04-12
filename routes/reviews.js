const router = require('express').Router();

const reviewsController = require('../controllers/reviews');
const { validateReview, validate, verifyReviewOwnership } = require('../middlewares/reviewValidator');
const {isAuthenticated} = require('../middlewares/authentication');

router.get('/', reviewsController.getAll);
router.get('/:id', reviewsController.getSingle);
router.post('/', isAuthenticated, validateReview(), validate, reviewsController.createReview);
router.put('/:id', isAuthenticated, verifyReviewOwnership, validateReview(), validate, reviewsController.updateReview);
router.delete('/:id', isAuthenticated, verifyReviewOwnership, reviewsController.deleteReview);

module.exports = router;