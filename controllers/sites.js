const { ObjectId } = require('mongodb');

const mongodb = require('../config/database');

const getAll = async (_, res) => {
    // #swagger.tags=['Sites']
    // #swagger.summary = 'Get A Site List'

    try {
        const result = await mongodb.getDatabase()
            .collection('sites')
            .find();

        result
            .toArray()
            .then((sites) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(sites);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const getById = async (req, res) => {
    // #swagger.tags=['Sites']
    // #swagger.summary = 'Get A Site'

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid site id to find a site.');
    }
    const siteId = new ObjectId(req.params.id);

    try {
        const result = await mongodb.getDatabase()
            .collection('sites')
            .findOne({ _id: siteId });

        if (result == null) {
            res.status(404).json('Site not found.');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const store = async (req, res) => {
    // #swagger.tags=['Sites']
    // #swagger.summary = 'Create A Site'
    const site = {
        name: req.body.name,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        city: req.body.city,
        country: req.body.country,
        category: req.body.category,
    }

    try {

        const response = await mongodb.getDatabase()
            .collection('sites')
            .insertOne(site);

        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while creating the site.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const update = async (req, res) => {
    // #swagger.tags=['Sites']
    // #swagger.summary = 'Update A Site'

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid site id to update a site.');
    }
    const siteId = new ObjectId(req.params.id);

    const site = {
        name: req.body.name,
        description: req.body.description,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        city: req.body.city,
        country: req.body.country,
        category: req.body.category,
    }

    try {
        const response = await mongodb.getDatabase()
            .collection('sites')
            .replaceOne({ _id: siteId }, site);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while updating the site.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

const deleteSite = async (req, res) => {
    // #swagger.tags=['Sites']
    // #swagger.summary = 'Delete A Site'

    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid site id to delete a site.');
    }
    const siteId = new ObjectId(req.params.id);

    try {
        const response = await mongodb.getDatabase()
            .collection('sites')
            .deleteOne({ _id: siteId }, true);

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500)
                .json(response.error || 'Some error occurred while deleting the site.');
        }
    } catch (err) {
        res.status(500)
            .json(err || 'Some error occurred. Please try again.');
    }
};

module.exports = {
    getAll,
    getById,
    store,
    update,
    deleteSite
};
