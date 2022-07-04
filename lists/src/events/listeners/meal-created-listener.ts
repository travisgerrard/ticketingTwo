import { Listener, MealCreatedEvent, Subjects } from '@tgticketing/common';
import { Message } from 'node-nats-streaming';
import { Meal } from '../../models/meal';
import { queueGroupName } from './queue-group-name';

export class MealCreatedListener extends Listener<MealCreatedEvent> {
  readonly subject = Subjects.MealCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: MealCreatedEvent['data'], msg: Message) {
    const { id, title } = data;
    const meal = Meal.build({
      id,
      title,
    });
    await meal.save();

    msg.ack();
  }
}
