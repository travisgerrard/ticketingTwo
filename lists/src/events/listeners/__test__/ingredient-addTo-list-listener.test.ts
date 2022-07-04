import {
  IngredientAddedToListEvent,
  IngredientType,
} from '@tgticketing/common';
import mongoose from 'mongoose';
import { List } from '../../../models/list';
import { Meal } from '../../../models/meal';
import { natsWrapper } from '../../../nats-wrapper';
import { IngredientAddToListListener } from '../ingredient-addTo-list-listener';

const setupWithMeal = async () => {
  const listener = new IngredientAddToListListener(natsWrapper.client);

  const meal = Meal.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'tofu bake',
  });
  await meal.save();

  const data: IngredientAddedToListEvent['data'] = {
    title: 'ingredient one',
    ingredientType: IngredientType.None,
    meal: meal!.id,
    currentUser: new mongoose.Types.ObjectId().toHexString(),
  };

  // create fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves an ingredient with meal', async () => {
  const { listener, data, msg } = await setupWithMeal();

  // call onMessage where list is created
  await listener.onMessage(data, msg);

  // write assertions to makes ure an ingredient was created
  const list = await List.find();

  expect(list![0].title).toEqual(data.title);
});

it('acks the message with meal', async () => {
  const { listener, data, msg } = await setupWithMeal();

  // call onMessage
  await listener.onMessage(data, msg);

  // write assertions to makes ure ack fybctuib is called
  expect(msg.ack).toHaveBeenCalled();
});
