const {body, param, validationResult} = require('express-validator');
const mongodb = require('../config/database');

async function findUser(username) {
    if (username) {
        return await mongodb.getDatabase().collection('users')
            .findOne({username: username.toLowerCase()});
    }
    return null;
}

const createUserRules = () => [
    body('username')
        .trim()
        .isLength({min: 8, max: 30})
        .withMessage('username must be between 8 and 30 characters.')
        .matches(/^[\w.\-@_]+$/)
        .withMessage('username must contain letters, numbers, hyphen, period, underscore, and `@` symbol')
        .custom(async (username) => {
            const user = await findUser(username);
            if (user != null) {
                throw new Error('User already exists');
            }
        })
        .withMessage('username already exists'),
    body('displayName')
        .trim()
        .notEmpty()
        .withMessage('displayName is required'),
    body('email')
        .optional({nullable: true})
        .if(body('email').notEmpty())
        .isEmail()
        .withMessage('email must be in a valid email format')
];

const updateUserRules = () => [
    param('username')
        .trim()
        .isLength({min: 8, max: 30})
        .withMessage('username must be between 8 and 30 characters.')
        .matches(/^[\w.\-@_]+$/)
        .withMessage('username must contain letters, numbers, hyphen, period, underscore, and `@` symbol'),
    body('displayName')
        .trim()
        .notEmpty()
        .withMessage('displayName is required'),
    body('email')
        .optional({nullable: true})
        .if(body('email').notEmpty())
        .isEmail()
        .withMessage('email must be in a valid email format')
];

const validate = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({[err.path]: err.msg}));

    return res.status(400).json({
        errors: extractedErrors,
    })
};


module.exports = {
    createUserRules,
    updateUserRules,
    validate
};
