import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

it('has a route handler listening to /api/lists for get requests', async () => {
  const response = await request(app).get('/api/lists').send({});

  expect(response.status).not.toEqual(400);
});
