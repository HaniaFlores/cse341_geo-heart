const mongodb = require('../config/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Get All Reviews Filtered By SiteId'
    const siteId = req.query.siteId;

    if (!ObjectId.isValid(siteId)) {
        return res.status(400).json('Must use a valid site id to find reviews.');
    }

    try {
        const result = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .find({ siteId: new ObjectId(siteId) });

        const reviews = await result.toArray();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(reviews);
        } catch (err) {
            res.status(500).json(err || 'Some error occurred. Please try again.');
        }
};

const getSingle = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Get A Single Review By Id'

    const reviewId = req.params.id;

    if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json('Must use a valid review id to find the review.');
    }

    try {
        const result = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .find({ _id: new ObjectId(reviewId) })
            .toArray();

        if (result.length === 0) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);  // Return the first result since `find` returns an array
    } catch (err) {
        res.status(500).json(err || 'Some error occurred. Please try again.');
    }
};

const createReview = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Create A Review'

    const { siteId, text, author, rating, isPrivate } = req.body;
    const parsedRating = parseInt(rating);
    // const author = req.user.username;

    try {
        const siteExists = await mongodb.getDatabase()
            .db()
            .collection('sites')
            .findOne({ _id: new ObjectId(siteId) });

        if (!siteExists) {
            return res.status(404).json({ message: 'Site not found in the database.' });
        }

        const review = {
            siteId: new ObjectId(siteId),
            text,
            author,
            rating: parsedRating,
            isPrivate
        };

        const response = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .insertOne(review);

        if (response.acknowledged) {
            res.status(201).json({ message: 'Review created successfully.', id: response.insertedId });
        } else {
            res.status(500).json(response.error || 'Some error occurred while creating the review.');
        }
    } catch (err) {
        res.status(500).json(err || 'Some error occurred. Please try again.');
    }
};

const updateReview = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Update A Review'

    const reviewId = req.params.id;
    const { text, rating, isPrivate } = req.body;

    const updatedReview = {
        text,
        rating: parseInt(rating),
        isPrivate,
    };

    try {
        const response = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .updateOne(
                { _id: new ObjectId(reviewId) },
                { $set: updatedReview }
            );

        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Review updated successfully.' });
        } else {
            res.status(404).json({ message: 'Review not found or no changes made.' });
        }
    } catch (err) {
        res.status(500).json(err || 'Some error occurred. Please try again.');
    }
};

const deleteReview = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Delete one of my Reviews'

    const reviewId = req.params.id;

    if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
    }

    try {
        const review = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .findOne({ _id: new ObjectId(reviewId) });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const response = await mongodb.getDatabase()
            .db()
            .collection('reviews')
            .deleteOne({ _id: new ObjectId(reviewId) });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Some error occurred while deleting the review.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message || 'Some error occurred. Please try again.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createReview,
    updateReview,
    deleteReview
};