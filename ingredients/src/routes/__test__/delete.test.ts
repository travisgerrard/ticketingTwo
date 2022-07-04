import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('deletes an ingredient', async () => {
  const cookie = global.signin();

  const title = 'asldkfj';

  const ingredient = await request(app)
    .post('/api/ingredients')
    .set('Cookie', cookie)
    .send({
      title,
    })
    .expect(201);

  await request(app)
    .delete(`/api/ingredients/${ingredient.body.id}`)
    .set('Cookie', cookie)
    .expect(204);

  const response = await request(app)
    .get('/api/ingredients')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(0);
});
