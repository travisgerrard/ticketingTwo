import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Meal } from '../../models/meal';

it('can fetch a list of comments for a meal', async () => {
  const meal = Meal.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Tofu bake',
  });
  await meal.save();

  const cookie = global.signin();
  const comment = 'comment';

  await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal.id,
      dateMade: new Date(),
    })
    .expect(201);

  await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal.id,
      dateMade: new Date(),
    })
    .expect(201);

  await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal.id,
      dateMade: new Date(),
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/comments/meal/${meal.id}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});
