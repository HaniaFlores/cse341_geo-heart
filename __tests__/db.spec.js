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
            const category = {name: name};
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
    });

    test('CRUD Sites', async () => {
        const sites = await client.db().collection('sites')
        const name = 'FAKE_SITE';
        const renamed = 'FAKE_SITE_2';

        try {
            const site = {
                name: name,
                description: 'a fake site for testing',
                latitude: '40.4094976',
                longitude: '-111.8896128',
                city: 'Lehi',
                country: 'United States',
                category: 'Fun',
            }
            // CREATE
            await sites.insertOne(site);

            // READ
            const inserted = await sites.findOne({name: name});
            expect(inserted).toEqual(site);

            // UPDATE
            site.name = renamed;
            sites.replaceOne({name: name}, site);

            // LIST
            const list = (await (await sites.find()).toArray()).filter(c => c.name === renamed);
            expect(list.length).toEqual(1);
            expect(list[0]).toEqual(site);
        } finally {
            // DELETE
            sites.deleteMany({name: name});
            let found = await sites.findOne({name: name});
            expect(found).toEqual(null);
            sites.deleteMany({name: renamed});
            found = await sites.findOne({name: renamed});
            expect(found).toEqual(null);
        }
    });

    test('CRUD Users', async () => {
        const users = await client.db().collection('users')
        const username = 'FAKE_USER_' + Math.random();
        const renamed = 'FAKE_USER_' + Math.random();

        try {
            const user = {
                username: username,
                displayName: 'We were testing',
                email: 'testing@test.com'
            }
            // CREATE
            await users.insertOne(user);

            // READ
            const inserted = await users.findOne({username: username});
            expect(inserted).toEqual(user);

            // UPDATE
            user.username = renamed;
            users.replaceOne({username: username}, user);

            // LIST
            const list = (await (await users.find()).toArray()).filter(c => c.username === renamed);
            expect(list.length).toEqual(1);
            expect(list[0]).toEqual(user);
        } finally {
            // DELETE
            users.deleteMany({username: username});
            let found = await users.findOne({username: username});
            expect(found).toEqual(null);
            users.deleteMany({username: renamed});
            found = await users.findOne({username: renamed});
            expect(found).toEqual(null);
        }
    });
});