import { MealUpdatedEvent } from '@tgticketing/common';
import mongoose from 'mongoose';
import { Meal } from '../../../models/meal';
import { natsWrapper } from '../../../nats-wrapper';
import { MealUpdatedListener } from '../meal-updated-listener';

const setup = async () => {
  const listener = new MealUpdatedListener(natsWrapper.client);

  const meal = Meal.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'new tofu',
  });
  await meal.save();

  const data: MealUpdatedEvent['data'] = {
    version: meal.version + 1,
    id: meal.id,
    title: 'tofu updated',
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, meal };
};

it('finds, updates and saves a male', async () => {
  const { listener, data, msg, meal } = await setup();

  await listener.onMessage(data, msg);

  const updateMeal = await Meal.findById(meal.id);

  expect(updateMeal!.title).toEqual(data.title);
  expect(updateMeal!.version).toEqual(data.version);
});
