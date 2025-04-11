const router = require('express').Router();

const reviewsController = require('../controllers/reviews');
const { validateReview, validate } = require('../middlewares/reviewValidator');

router.get('/', reviewsController.getAll);
router.get('/:id', validateReview(), validate, reviewsController.getSingle);
router.post('/', validateReview(), validate, reviewsController.createReview);
router.put('/:id', validateReview(), validate, reviewsController.updateReview);
router.delete('/:id', reviewsController.deleteReview);

module.exports = router;