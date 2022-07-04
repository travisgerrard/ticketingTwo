import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Meal } from '../../models/meal';

it('updates the comment provided valid inputs', async () => {
  const meal = Meal.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Tofu bake',
  });
  await meal.save();
  const cookie = global.signin();

  const comment = 'comment';
  const updatedComment = 'updatedComment';
  const dateMade = new Date();
  dateMade.setMonth(dateMade.getMonth() - 10);

  const response = await request(app)
    .post('/api/comments')
    .set('Cookie', cookie)
    .send({
      comment,
      mealId: meal.id,
      dateMade: new Date(),
    })
    .expect(201);

  const updateOne = await request(app)
    .put(`/api/comments/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      comment: updatedComment,
      dateMade: response.body.dateMade,
    })
    .expect(200);

  expect(updateOne.body.comment).toEqual(updatedComment);

  expect(updateOne.body.dateMade).toEqual(response.body.dateMade);

  const updateTwo = await request(app)
    .put(`/api/comments/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      comment,
      dateMade,
    })
    .expect(200);

  expect(updateTwo.body.comment).toEqual(comment);
  expect(updateTwo.body.dateMade).toEqual(dateMade.toISOString());
  expect(updateTwo.body.dateMade).not.toEqual(response.body.dateMade);
});
