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

describe('Test Handlers', () => {
    test('responds to /', async () => {
        const res = await request.get('/categories');
        expect(res.statusCode).toBe(200);
        expect(res.text).toEqual('Logged out');
    })
})
