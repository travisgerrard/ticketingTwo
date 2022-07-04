import { Listener, MealUpdatedEvent, Subjects } from '@tgticketing/common';
import { Message } from 'node-nats-streaming';
import { Meal } from '../../models/meal';
import { queueGroupName } from './queue-group-name';

export class MealUpdatedListener extends Listener<MealUpdatedEvent> {
  readonly subject = Subjects.MealUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: MealUpdatedEvent['data'], msg: Message) {
    const meal = await Meal.findByEvent(data);

    if (!meal) {
      throw new Error('Meal not found');
    }

    const { title } = data;
    meal.set({ title });
    await meal.save();

    msg.ack();
  }
}
