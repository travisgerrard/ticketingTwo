import mongoose from 'mongoose';

export const stripe = {
  charges: {
    create: jest
      .fn()
      .mockReturnValue({ id: new mongoose.Types.ObjectId().toHexString() }),
  },
};
