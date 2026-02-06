const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Campus Resource Portal API',
            version: '1.0.0',
            description: 'API Documentation for the Campus Resource Portal',
            contact: {
                name: 'Developer',
            },
            servers: [{ url: 'http://localhost:5000' }],
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

module.exports = swaggerJsDoc(swaggerOptions);
