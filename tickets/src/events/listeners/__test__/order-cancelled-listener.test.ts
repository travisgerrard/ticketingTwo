import { OrderCancelledEvent } from '@tgticketing/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  // create listner
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  // create and dave a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  ticket.set({ orderId });
  await ticket.save();

  // create fake data
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('update ticket, publishes an even, acks the mssage', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedticket = await Ticket.findById(ticket.id);
  expect(updatedticket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
