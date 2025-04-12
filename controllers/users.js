const mongodb = require('../config/database');

const getAll = async (_, res) => {
    // #swagger.tags=['Users']
    // #swagger.summary = 'Get All Users'
    try {
        const result = await mongodb.getDatabase().collection('users').find();

        result
            .toArray()
            .then((users) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(users);
            })
            .catch((err) => {
                res.status(400).json({message: err});
            });
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const getByUsername = async (req, res) => {
    // #swagger.tags=['Users']
    // #swagger.summary = 'Get A User'

    const username = req.params.username;
    if (!username) {
        return res.status(400).json('Please supply a username');
    }

    try {
        const result = await mongodb.getDatabase()
            .collection('users')
            .findOne({username: username.toLowerCase()});

        if (!result) {
            return res.status(404).json({message: 'User not found.'});
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);

    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const createUser = async (req, res) => {
    // #swagger.tags=['Users']
    // #swagger.summary = 'Create A User'

    const user = {
        username: req.body.username,
        name: req.body.displayName,
        email: req.body.email
    }

    try {
        const response = await mongodb.getDatabase()
            .collection('users')
            .insertOne(user);

        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while creating the user.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const updateUser = async (req, res) => {
    // #swagger.tags=['Users']
    // #swagger.summary = 'Rename A User'

    const username = req.params.username;
    if (!username) {
        return res.status(400).json('Please supply a username');
    }

    try {
        const found = await mongodb.getDatabase()
            .collection('users')
            .findOne({username: username.toLowerCase()});

        if (!found) {
            return res.status(404).json({message: 'User not found.'});
        }

        const user = {
            username: username.toLowerCase(),
            displayName: req.body.displayName,
            email: req.body.email
        }

        const response = await mongodb.getDatabase()
            .collection('users')
            .replaceOne({username: username.toLowerCase()}, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while updating the user.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const deleteUser = async (req, res) => {
    // #swagger.tags=['Users']
    // #swagger.summary = 'Delete A User'

    const username = req.params.username;
    if (!username) {
        return res.status(400).json('Please supply a username');
    }

    try {
        const response = await mongodb.getDatabase()
            .collection('users')
            .deleteOne({username: username.toLowerCase()});

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(400).json(response.error || 'User not deleted.');
        }
    } catch (err) {
        console.log(err)
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

module.exports = {
    getAll,
    getByUsername,
    createUser,
    updateUser,
    deleteUser
};