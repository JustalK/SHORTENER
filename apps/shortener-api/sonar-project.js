// @ts-nocheck
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../env/dev.env' });
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: `http://sonar.net`,
    options: {
      'sonar.login': process.env.SONAR_LOGIN || 'admin',
      'sonar.password': process.env.SONAR_PASSWORD || 'test',
      'sonar.sources': 'src',
      'sonar.projectKey': 'shortener-api',
      'sonar.inclusions': '**',
    },
  },
  () => {
    //
  }
);
