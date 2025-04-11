const { check, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const validateReview = () => [
    check('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5.'),

    check('isPrivate')
        .optional()
        .customSanitizer((value) => {
            if (typeof value === 'string') {
                const normalized = value.trim().toLowerCase();
                return normalized === 'true';
            }
            return Boolean(value);
        })
        .isBoolean()
        .withMessage('isPrivate must be true or false.'),

    check('siteId')
        .optional()
        .custom((value) => {
            if (!ObjectId.isValid(value)) {
                throw new Error('Invalid site ID.');
            }
            return true;
        })
];

const validate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const verifyReviewOwnership = async (req, res, next) => {
    const reviewId = req.params.id;
    const currentUser = req.user?.username;

    if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
    }

    try {
        const review = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .findOne({ _id: new ObjectId(reviewId) });

        if (review.author !== currentUser) {
            return res.status(403).json({ message: 'You are not authorized to access this review.' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Error verifying review ownership.', error: err });
    }
};

module.exports = {
    validateReview,
    validate,
    verifyReviewOwnership
};
