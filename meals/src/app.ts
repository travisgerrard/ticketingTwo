import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tgticketing/common';
import { createMealRouter } from './routes/new';
import { indexMealRouter } from './routes';
import { updateMealRouter } from './routes/update';
import { showMealRouter } from './routes/show';

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

app.use(indexMealRouter);
app.use(createMealRouter);
app.use(updateMealRouter);
app.use(showMealRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
