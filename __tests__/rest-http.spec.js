const app = require('../server')
const supertest = require('supertest');
const request = supertest(app)

const { MongoClient, ObjectId} = require('mongodb');

let client;

beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGODB_URL);
});

afterAll(async () => {
    await client.close();
});

describe('GET /categories', () => {
    test('should return all categories', async () => {
        const res = await request.get('/categories');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return a category by name', async () => {
        const res = await request.get('/categories/Fun');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toBe('Fun');
    });

    test('should return 404 for non-existing category name', async () => {
        const res = await request.get('/categories/fakeCategory');
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Category not found.');
    });
});

describe('GET /sites', () => {

    test('should return all sites. take first then find it by id', async () => {
        let found;

        const res = await request.get('/sites');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body && res.body.length > 0) {
            found = res.body[0];
        }

        if (found) {
            const res = await request.get(`/sites/${found._id}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe(found.name);
        }
    });

    test('should return 404 for non-existing site name', async () => {
        const fakeId = new ObjectId();
        const res = await request.get(`/sites/${fakeId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toBe('Site not found.');
    });

    test('should return 404 for bogus site id', async () => {
        const res = await request.get('/sites/bogusid');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual('Must use a valid site id to find a site.');
    });
});

describe('GET /users', () => {
    test('should return all users', async () => {
        const res = await request.get('/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('should return a user by username', async () => {
        const username = 'ross-owen'
        const res = await request.get(`/users/${username}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.username).toBe(username);
    });

    test('should return 404 for non-existing user name', async () => {
        const res = await request.get('/users/fakeUser');
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('User not found.');
    });
});

describe('GET /reviews', () => {
    test('should return all reviews by siteId', async () => {
        const siteId = '67f0a3a60fe3c270e3c39492';
        const res = await request.get(`/reviews?siteId=${siteId}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        res.body.forEach(review => {
            expect(review.siteId).toBe(siteId);
        });
    });

    test('should return 404 for non-existing siteId', async () => {
        const fakeSiteId = 'nonExistingSiteId';
        const res = await request.get(`/reviews?siteId=${fakeSiteId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid siteId.');
    });

    test('should return a review by ID', async () => {
        const reviewId = '67fa6fed6b14a6947b5878d8';
        const res = await request.get(`/reviews/${reviewId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body._id).toBe(reviewId);
    });

    test('should return 404 for non-existing review ID', async () => {
        const fakeId = new ObjectId();
        const res = await request.get(`/reviews/${fakeId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Review not found.');
    });
});

