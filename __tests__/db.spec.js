const {MongoClient, ObjectId} = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let client;

beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGODB_URL);
});

afterAll(async () => {
    await client.close();
});

describe('DB CRUD', () => {

    test('CRUD Categories', async () => {
            const categories = await client.db().collection('categories')
            const name = 'FAKE_CATEGORY';
            const renamed = 'FAKE_CATEGORY_2';

            try {
                const category = { name: name };
                // CREATE
                await categories.insertOne(category);

                // READ
                const inserted = await categories.findOne({name: name});
                expect(inserted).toEqual(category);

                // UPDATE
                category.name = renamed;
                categories.replaceOne({name: name}, category);

                // LIST
                const list = (await (await categories.find()).toArray()).filter(c => c.name === renamed);
                expect(list.length).toEqual(1);
                expect(list[0]).toEqual(category);
            } finally {
                // DELETE
                categories.deleteMany({name: name});
                let found = await categories.findOne({name: name});
                expect(found).toEqual(null);
                categories.deleteMany({name: renamed});
                found = await categories.findOne({name: renamed});
                expect(found).toEqual(null);
            }
        }
    )
});