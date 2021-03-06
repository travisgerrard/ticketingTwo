import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tgticketing/common';
import { indexListRouter } from './routes';
import { toggleListRouter } from './routes/toggle';
import { deleteListRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false, //process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(indexListRouter);
app.use(toggleListRouter);
app.use(deleteListRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
