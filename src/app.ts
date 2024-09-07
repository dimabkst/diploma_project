require('dotenv').config();
import express, { Request, Response } from 'express';
import path from 'path';
import logger from './utils/logger';

const { PORT } = process.env;

const app = express();
const port = PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.post('/submit', (req: Request, res: Response) => {
  const { name } = req.body;
  res.send(`<div>Hello, ${name}! asd</div>`);
});

app.listen(port, () => {
  logger.info(`Application started on port ${port}!`);
});
