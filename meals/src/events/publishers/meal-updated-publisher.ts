import { MealUpdatedEvent, Publisher, Subjects } from '@tgticketing/common';

export class MealUpdatedPublisher extends Publisher<MealUpdatedEvent> {
  readonly subject = Subjects.MealUpdated;
}
