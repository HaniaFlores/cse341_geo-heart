const { check, validationResult } = require('express-validator');
const mongodb = require('../config/database');

const categoryValidationRules = () => [
    check('name')
        .trim()
        .isLength({ min: 3, max: 15 })
        .withMessage('Category name must be between 3 and 15 characters.')
        .matches(/^[a-zA-Z]+$/)
        .withMessage('Category name must contain only letters.')
];

const validate = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.body || !req.body.name) { // GET or DELETE requests
        return next();
    }

    try {
        const existingCategory = await mongodb.getDatabase()
            .collection('categories')
            .findOne({ name: { $regex: `^${req.body.name}$`, $options: 'i' } });

        if (existingCategory) {
            return res.status(400).json({ message: 'Category name already exists.' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Error checking category uniqueness.', error: err });
    }
};


module.exports = {
    categoryValidationRules,
    validate
};
