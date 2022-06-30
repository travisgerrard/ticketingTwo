import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@tgticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
