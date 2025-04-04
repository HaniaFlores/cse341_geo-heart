const mongodb = require('../config/database');

const getAll = async (_, res) => {
    // #swagger.tags=['Categories']
    // #swagger.summary = 'Get All Categories'
    try {
        const result = await mongodb.getDatabase()
            .db()
            .collection('categories')
            .find();

        result
            .toArray()
            .then((categories) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(categories);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const getByName = async (req, res) => {
    // #swagger.tags=['Categories']
    // #swagger.summary = 'Get A Category'

    const categoryName = req.params.name;

    try {
        const result = await mongodb.getDatabase()
            .db()
            .collection('categories')
            .findOne({ name: { $regex: `^${categoryName}$`, $options: 'i' } });

        if (!result) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);

    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const createCategory = async (req, res) => {
    // #swagger.tags=['Categories']
    // #swagger.summary = 'Create A Category'
    const formattedName = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1).toLowerCase();

    const category = {
        name: formattedName,
    }

    try {
        const response = await mongodb.getDatabase()
            .db()
            .collection('categories')
            .insertOne(category);

        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while creating the category.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const updateCategory = async (req, res) => {
    // #swagger.tags=['Categories']
    // #swagger.summary = 'Rename A Category'

    const categoryName = req.params.name;

    const formattedName = req.body.name.charAt(0).toUpperCase() + req.body.name.slice(1).toLowerCase();

    const updatedName = {
        name: formattedName,
    };

    try {
        const response = await mongodb.getDatabase()
            .db()
            .collection('categories')
            .replaceOne({ name: { $regex: `^${categoryName}$`, $options: 'i' } },
                updatedName);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while updating the category.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const deleteCategory = async (req, res) => {
    // #swagger.tags=['Categories']
    // #swagger.summary = 'Delete A Category'

    const categoryName = req.params.name;

    try {
        const response = await mongodb.getDatabase()
            .db()
            .collection('categories')
            .deleteOne({ name: { $regex: `^${categoryName}$`, $options: 'i' } });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while deleting the category.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

module.exports = {
    getAll,
    getByName,
    createCategory,
    updateCategory,
    deleteCategory
};