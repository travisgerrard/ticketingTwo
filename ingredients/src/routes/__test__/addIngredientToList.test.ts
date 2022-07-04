import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ingredient } from '../../models/ingredient';
import { Meal } from '../../models/meal';
import { natsWrapper } from '../../nats-wrapper';

const createIngredientWithMeal = async () => {
  const mealTitle = 'Tofu bake';
  const title = 'asldkfj';

  const meal = Meal.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: mealTitle,
  });
  await meal.save();

  return request(app)
    .post('/api/ingredients')
    .set('Cookie', global.signin())
    .send({
      title,
      mealId: meal.id,
    })
    .expect(201);
};

it('publishes an event', async () => {
  const ingredient = await createIngredientWithMeal();

  await request(app)
    .post(`/api/ingredients/addIngredientToList/${ingredient.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
