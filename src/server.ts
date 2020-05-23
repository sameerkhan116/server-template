import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import { urlencoded } from 'body-parser';
require('dotenv').config();

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(urlencoded({ extended: true }));
// default options
app.use(
  cors({
    origin: '*'
  })
);

app.get('/', (_: express.Request, res: express.Response) => res.send(200));

app.disable('x-powered-by');

export { app };
