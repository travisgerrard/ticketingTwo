import { MealCreatedEvent, Publisher, Subjects } from '@tgticketing/common';

export class MealCreatedPublisher extends Publisher<MealCreatedEvent> {
  readonly subject = Subjects.MealCreated;
}
