import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  //create instance
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  //save ticket to database
  await ticket.save();

  //fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two seperate change to the ticket we fetch
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error('Shoud not reach this point');
});

it('inreiments version number on multiple saves', async () => {
  //create instance
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  //save ticket to database
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
  await ticket.save();
  expect(ticket.version).toEqual(3);
});
