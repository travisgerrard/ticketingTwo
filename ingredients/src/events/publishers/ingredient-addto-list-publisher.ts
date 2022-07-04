import {
  IngredientAddedToListEvent,
  Publisher,
  Subjects,
} from '@tgticketing/common';

export class IngredientAddedToListPublisher extends Publisher<IngredientAddedToListEvent> {
  readonly subject = Subjects.IngredientAddedToList;
}
