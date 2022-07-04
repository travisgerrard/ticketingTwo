import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tgticketing/common';
import { createIngredientRouter } from './routes/new';
import { indexIngredientRouter } from './routes';
import { updateIngredientRouter } from './routes/update';
import { showIngredientRouter } from './routes/show';
import { showIngredientsForMealRouter } from './routes/showForMeal';
import { deleteIngredientRouter } from './routes/delete';
import { decreaseIngredientOrderRouter } from './routes/decreaseOrderForMeal';
import { increaseIngredientOrderRouter } from './routes/increaseOrderForMeal';

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

app.use(indexIngredientRouter);
app.use(createIngredientRouter);
app.use(updateIngredientRouter);
app.use(showIngredientRouter);
app.use(showIngredientsForMealRouter);
app.use(deleteIngredientRouter);
app.use(decreaseIngredientOrderRouter);
app.use(increaseIngredientOrderRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
