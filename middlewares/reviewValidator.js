const { check, validationResult } = require('express-validator');
const { ObjectId } = require('mongodb');

const validateReview = () => [
    check('rating')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be an integer between 1 and 5.'),

    check('isPrivate')
        .optional()
        .isBoolean()
        .withMessage('isPrivate must be a True or False.'),

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

module.exports = {
    validateReview,
    validate
};
