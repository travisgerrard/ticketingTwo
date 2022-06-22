import { Publisher, OrderCancelledEvent, Subjects } from '@tgticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
