const swaggerAutogen = require('swagger-autogen')();

// Swagger documentation configuration
// This file generates the Swagger documentation for the Employee Task Management System API
const doc = {
    info: {
        title: 'Employee Task Management System API',
        description: 'API documentation for managing employees and tasks in a CRUD project.'
    },
    host: 'localhost:3000',
    schemes: ['http', 'https'],
};

// Routes to be documented
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate the Swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc);