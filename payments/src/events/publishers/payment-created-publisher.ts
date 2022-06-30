import { Publisher, PaymentCreatedEvent, Subjects } from '@tgticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
