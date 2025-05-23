const mongodb = require('../config/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Get All Reviews Filtered By SiteId'
    const siteId = req.query.siteId;

    if (!ObjectId.isValid(siteId)) {
        return res.status(400).json({ message: 'Invalid siteId.' });
    }

    const currentUser = req.session.user?.username;

    try {
        const result = await mongodb.getDatabase()
            .collection('reviews')
            .find({
                siteId: new ObjectId(siteId),
                $or: [
                    { author: currentUser },
                    { isPrivate: false }
                ]
            });

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
    const currentUser = req.session.user?.username;

    if (!ObjectId.isValid(reviewId)) {
        return res.status(400).json({ message: 'Invalid review ID.' });
    }

    try {
        const review = await mongodb.getDatabase()
            .collection('reviews')
            .findOne({ _id: new ObjectId(reviewId) });

        if (!review) {
            return res.status(404).json({ message: 'Review not found.' });
        }

        const isOwner = review.author === currentUser;
        const isPublic = review.isPrivate === false;

        if (!isOwner && !isPublic) {
            return res.status(403).json({ message: 'You are not authorized to access this review.' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(review);
    } catch (err) {
        console.error('Error in GET /reviews/:id:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
};


const createReview = async (req, res) => {
    // #swagger.tags=['Reviews']
    // #swagger.summary = 'Create A Review'

    const { siteId, text, rating, isPrivate } = req.body;
    const parsedRating = parseInt(rating);
    const author = req.session.user?.username;

    try {
        const siteExists = await mongodb.getDatabase()
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
            .collection('reviews')
            .insertOne(review);

        if (response.acknowledged) {
            res.status(201).json({ message: 'Review created successfully.' });
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
            .collection('reviews')
            .findOne({ _id: new ObjectId(reviewId) });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const response = await mongodb.getDatabase()
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