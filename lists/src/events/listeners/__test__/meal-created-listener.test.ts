import { Message } from 'node-nats-streaming';
import { MealCreatedEvent } from '@tgticketing/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { MealCreatedListener } from '../meal-created-listener';
import { Meal } from '../../../models/meal';

const setup = async () => {
  const listener = new MealCreatedListener(natsWrapper.client);

  const data: MealCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'tofu bake',
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a meal', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage
  await listener.onMessage(data, msg);

  // write assertions to makes ure a ticket was created
  const meal = await Meal.findById(data.id);

  expect(meal).toBeDefined();
  expect(meal!.title).toEqual(data.title);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call onMessage
  await listener.onMessage(data, msg);

  // write assertions to makes ure ack fybctuib is called
  expect(msg.ack).toHaveBeenCalled();
});
