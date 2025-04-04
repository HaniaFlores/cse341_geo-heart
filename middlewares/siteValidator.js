const { body, validationResult } = require('express-validator');

const siteValidationRules = () => {
    return [
        body('name', 'Name is required').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty(),
        body('latitude', 'Latitude must be a decimal number').isFloat(),
        body('longitude', 'Longitude must be a decimal number').isFloat(),
        body('city', 'City is required').not().isEmpty(),
        body('country', 'Country is required').not().isEmpty(),
        body('category', 'Category is required').not().isEmpty(),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
}

module.exports = {
    siteValidationRules,
    validate
}
