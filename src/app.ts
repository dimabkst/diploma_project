require('dotenv').config();
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import prisma from './db';
import { checkAuth } from './auth/services';
import { RequestWithUser } from './utils/types';
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

app.use(auth);
app.use('/api', api);

// TODO: change this logic, fix multiple renderings on client after redirect to login, remove all ssr routes
app.get('/', checkAuth({ allowUnauthenticated: true }), (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return res.render('index');
});

app.get('*', (req: Request, res: Response) => {
  return res.render('layout');
});

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
