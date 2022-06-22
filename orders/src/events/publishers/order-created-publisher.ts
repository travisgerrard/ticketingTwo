import { Publisher, OrderCreatedEvent, Subjects } from '@tgticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
