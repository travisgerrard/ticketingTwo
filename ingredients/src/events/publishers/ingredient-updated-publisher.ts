import {
  IngredientUpdatedEvent,
  Publisher,
  Subjects,
} from '@tgticketing/common';

export class IngredientUpdatedPublisher extends Publisher<IngredientUpdatedEvent> {
  readonly subject = Subjects.IngredientUpdated;
}
