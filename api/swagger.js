import swaggerAutogen from 'swagger-autogen'

const doc = {
    swagger: "2.0",
    info: {
        version: "1.0.0",
        title: "API Compras Fatec Votorantim"
    },
    host: 'projeto-mvc-restful-server.vercel.app',
    basePath: "/",
    schemes: ['https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        apiKeyAuth:{
            type: "apiKey",
            in: "header",
            name: "access-token",
            description: "Token de Acesso gerado após o login"
        }
    },
    definitions: {
        Erro: {
            value: "Erro gerado pela aplicação",
            msg: "Mensagem detalhando o erro",
            param: "URL que gerou o erro"
        }
    }
}

const outputFile = './swagger/swagger_output.json'
const endpointsFiles = ['./app.js']
const options = {
    swagger: '2.0',
    language: 'pt-BR',
    disableLogs: false,
    disableWarnings: false
}

swaggerAutogen(options)(outputFile, endpointsFiles, doc).then(async () => {
    await import('./app.js');
  });