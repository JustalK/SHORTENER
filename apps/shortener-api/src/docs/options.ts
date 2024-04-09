import ENVIRONMENT from '@src/environment';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: ENVIRONMENT.PROJECT.NAME,
      version: ENVIRONMENT.API.VERSION,
      description:
        'This is a simple shortener application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: ENVIRONMENT.PROJECT.CONTACT.NAME,
        email: ENVIRONMENT.PROJECT.CONTACT.EMAIL,
      },
    },
    servers: [
      {
        url: `${ENVIRONMENT.SERVER.PROTOCOL}://${ENVIRONMENT.SERVER.HOST}:${ENVIRONMENT.SERVER.PORT}`,
      },
    ],
  },
  apis: [
    './apps/shortener-api/src/routes/*.ts',
    './apps/shortener-api/src/models/*.ts',
  ],
};

export default options;
