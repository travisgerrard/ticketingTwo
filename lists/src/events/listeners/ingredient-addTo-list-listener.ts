import {
  Listener,
  Subjects,
  IngredientAddedToListEvent,
  currentUser,
  NotFoundError,
} from '@tgticketing/common';
import { Message } from 'node-nats-streaming';
import { List } from '../../models/list';
import { Meal, MealDoc } from '../../models/meal';
import { queueGroupName } from './queue-group-name';

export class IngredientAddToListListener extends Listener<IngredientAddedToListEvent> {
  readonly subject = Subjects.IngredientAddedToList;
  queueGroupName = queueGroupName;

  async onMessage(data: IngredientAddedToListEvent['data'], msg: Message) {
    const { title, ingredientType, meal, currentUser } = data;

    const mealToAssociate = await Meal.findOne({ id: meal });

    if (!mealToAssociate) {
      throw new NotFoundError();
    }

    const list = List.build({
      title,
      ingredientType,
      meal: mealToAssociate,
      creatorId: currentUser,
      isCompleted: false,
    });
    await list.save();

    msg.ack();
  }
}
