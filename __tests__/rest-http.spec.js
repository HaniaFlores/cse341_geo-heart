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
    test('should return all categories when name path param is missing', async () => {
        const res = await request.get('/categories');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
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
        expect(res.body).toBe('Must use a valid site id to find a site.');
    });

    test('should return all sites when name path param is missing', async () => {
        const res = await request.get('/sites');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
