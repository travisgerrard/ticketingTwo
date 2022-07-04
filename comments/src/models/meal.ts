import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface MealAttrs {
  id: string;
  title: string;
}

export interface MealDoc extends mongoose.Document {
  title: string;
  version: number;
}

interface MealModel extends mongoose.Model<MealDoc> {
  build(attrs: MealAttrs): MealDoc;
  findByEvent(event: { id: string; version: number }): Promise<MealDoc | null>;
}

const mealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
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
mealSchema.plugin(updateIfCurrentPlugin);

mealSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Meal.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

mealSchema.statics.build = (attrs: MealAttrs) => {
  return new Meal({
    _id: attrs.id,
    title: attrs.title,
  });
};

const Meal = mongoose.model<MealDoc, MealModel>('Meal', mealSchema);

export { Meal };
