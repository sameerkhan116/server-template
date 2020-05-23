import * as AWS from 'aws-sdk';
import { createConnection } from 'typeorm';

import { app } from './server';
require('dotenv').config();

const ssm = new AWS.SSM({ region: 'us-east-1' });
const PORT = 5000;

const globalVariables: string[] = [];

export const getSSMVariables = async () => {
  const envs = {};

  for (const item of globalVariables) {
    if (process.env.NODE_ENV === 'development') {
      envs[item] = process.env[item];
    } else {
      const val = await ssm.getParameter({ Name: item }).promise();
      envs[item] = val.Parameter ? val.Parameter.Value : '';
    }
  }

  return envs;
};

const setEnv = async () => {
  const res = await getSSMVariables();
  for (const key in res) {
    if (res.hasOwnProperty(key)) {
      process.env[key] = res[key];
    }
  }
};

setEnv().then(() => {
  createConnection({
    type: 'mysql',
    host: '',
    port: 3306,
    username: '',
    password: '',
    database: '',
    // database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [],
    cli: {
      entitiesDir: './entity'
    }
  }).then(() => {
    console.log('Connected to DB!');
    app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    });
  });
});
