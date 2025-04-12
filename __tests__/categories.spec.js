const app = require('../server')
const supertest = require('supertest');
const request = supertest(app)

const { MongoClient } = require('mongodb');

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
    test('should return all categories when name query param is missing', async () => {
        const res = await request.get('/categories');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
