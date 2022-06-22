import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@tgticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find ticket that order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if not ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // mark ticket as being resreved by setting orderIdPrperty
    ticket.set({ orderId: data.id });

    // sav eticket
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
