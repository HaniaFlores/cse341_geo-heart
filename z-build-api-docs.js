const swaggerAutogen = require('swagger-autogen');

const public = {
    info: {
        title: 'GeoHeart',
        description: 'Sites of Interest'
    },
    host: 'cse341-geo-heart.onrender.com',
    schemes: ['https'],
};

const dev = {
    info: {
        title: 'GeoHeart',
        description: 'Sites of Interest'
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, public);