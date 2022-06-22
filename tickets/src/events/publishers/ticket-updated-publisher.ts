import { Publisher, Subjects, TicketUpdatedEvent } from '@tgticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
