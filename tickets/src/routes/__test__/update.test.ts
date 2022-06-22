import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdf',
      price: 10,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asfasdf',
      price: 10,
    })
    .expect(401);
});

it('returns a 401 user does not own the ticket', async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdf',
      price: 10,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asfasdfasfsdafds',
      price: 1001,
    })
    .expect(401);
});

it('returns a 400 user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1001,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdfef',
      price: -10,
    })
    .expect(400);
});
it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 1001,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(1001);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 1001,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejcets updates if ticket is resreved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/tickets/`)
    .set('Cookie', cookie)
    .send({
      title: 'asfasdf',
      price: 10,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 1001,
    })
    .expect(400);
});
