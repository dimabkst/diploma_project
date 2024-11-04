require('dotenv').config();
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import prisma from './db';
import logger from './utils/logger';

import auth from './auth';
import api from './api';

const { PORT } = process.env;

const app = express();
const port = PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  return res.render('index');
});

app.use(auth);
app.use('/api', api);

const connectDb = async () => {
  await prisma.$connect();
};

connectDb()
  .then(() => {
    logger.info('Database successfully connected');

    app.listen(port, () => {
      logger.info(`Application started on port ${port}!`);
    });
  })
  .catch((e) => {
    logger.error(e);

    process.exit(1);
  });
