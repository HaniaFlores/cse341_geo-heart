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

function randomInt() {
    return Math.floor(Math.random() * 1000);
}

describe('DB CRUD', () => {

    test('CRUD Categories', async () => {
        const categories = await client.db().collection('categories')
        const name = 'FAKE_CATEGORY_' + randomInt();
        const renamed = 'FAKE_CATEGORY_' + randomInt();

        try {
            const category = {name: name};
            // CREATE
            await categories.insertOne(category);

            // READ
            const inserted = await categories.findOne({name: name});
            expect(inserted).toEqual(category);

            // UPDATE
            category.name = renamed;
            await categories.replaceOne({name: name}, category);

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
        const name = 'FAKE_SITE_' + randomInt();
        const renamed = 'FAKE_SITE_' + randomInt();

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
            await sites.replaceOne({name: name}, site);

            // LIST
            const list = (await (await sites.find()).toArray()).filter(c => c.name === renamed);
            expect(list.length).toEqual(1);
            expect(list[0]).toEqual(site);
        } finally {
            // DELETE
            await sites.deleteMany({name: name});
            let found = await sites.findOne({name: name});
            expect(found).toEqual(null);
            await sites.deleteMany({name: renamed});
            found = await sites.findOne({name: renamed});
            expect(found).toEqual(null);
        }
    });

    test('CRUD Users', async () => {
        const users = await client.db().collection('users')
        const username = 'FAKE_USER_' + randomInt();
        const renamed = 'FAKE_USER_' + randomInt();

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
            await users.replaceOne({username: username}, user);

            // LIST
            let result = await users.find();
            let userList = await result.toArray();
            const list = userList.filter(c => c.username === renamed);
            expect(list.length).toEqual(1);
            expect(list[0]).toEqual(user);
        } finally {
            // DELETE
            await users.deleteMany({username: username});
            let found = await users.findOne({username: username});
            expect(found).toEqual(null);
            await users.deleteMany({username: renamed});
            found = await users.findOne({username: renamed});
            expect(found).toEqual(null);
        }
    });

    test('CRUD Reviews', async () => {
        const reviews = await client.db().collection('reviews')
        const text = 'FAKE_REVIEW_' + randomInt();
        const renamed = 'FAKE_REVIEW_' + randomInt();

        try {
            const review = {
                text: text,
                author: 'Testing Author',
                rating: 3,
                isPrivate: false
            }
            // CREATE
            await reviews.insertOne(review);

            // READ
            const inserted = await reviews.findOne({text: text});
            expect(inserted).toEqual(review);

            // UPDATE
            review.text = renamed;
            await reviews.replaceOne({text: text}, review);

            // LIST
            let result = await reviews.find();
            let userList = await result.toArray();
            const list = userList.filter(c => c.text === renamed);
            expect(list.length).toEqual(1);
            expect(list[0]).toEqual(review);
        } finally {
            // DELETE
            await reviews.deleteMany({text: text});
            let found = await reviews.findOne({text: text});
            expect(found).toEqual(null);
            await reviews.deleteMany({text: renamed});
            found = await reviews.findOne({text: renamed});
            expect(found).toEqual(null);
        }
    });
});