import {
  IngredientCreatedEvent,
  Publisher,
  Subjects,
} from '@tgticketing/common';

export class IngredientCreatedPublisher extends Publisher<IngredientCreatedEvent> {
  readonly subject = Subjects.IngredientCreated;
}
