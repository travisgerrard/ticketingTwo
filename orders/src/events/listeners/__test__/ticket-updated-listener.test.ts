import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@tgticketing/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListner } from '../ticket-updated-listener';

const setup = async () => {
  // create listner
  const listener = new TicketUpdatedListner(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create fake dats
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket!.title).toEqual(data.title);
  expect(updateTicket!.price).toEqual(data.price);
  expect(updateTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toBeCalled();
});

it('does not acks the message if wrong version number', async () => {
  const { listener, data, msg, ticket } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
