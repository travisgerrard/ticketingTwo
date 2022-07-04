import { MealType } from '@tgticketing/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { MealType };

interface MealAttrs {
  title: string;
  whereToFind: string;
  imageUrl: string;
  mealType: MealType;
  creatorId: string;
}

interface MealDoc extends mongoose.Document {
  title: string;
  whereToFind: string;
  imageUrl: string;
  mealType: MealType;
  creatorId: string;
  version: number;
}

interface MealModel extends mongoose.Model<MealDoc> {
  build(attrs: MealAttrs): MealDoc;
}

const mealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    whereToFind: {
      type: String,
      require: false,
    },
    imageUrl: {
      type: String,
      require: false,
    },
    creatorId: {
      type: String,
      require: true,
    },
    mealType: {
      type: String,
      required: false,
      enum: Object.values(MealType),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

mealSchema.set('versionKey', 'version');
mealSchema.set('timestamps', true);
mealSchema.plugin(updateIfCurrentPlugin);

mealSchema.statics.build = (attrs: MealAttrs) => {
  return new Meal(attrs);
};

const Meal = mongoose.model<MealDoc, MealModel>('Meal', mealSchema);

export { Meal };
