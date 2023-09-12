import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json'; // Define where the Swagger file will be saved
const endpointsFiles = ['./src/index.ts']; // Define the entry point file(s) of your application

swaggerAutogen()(outputFile, endpointsFiles);
