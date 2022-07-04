import mongoose from 'mongoose';
import { IngredientType } from '@tgticketing/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MealDoc } from './meal';

interface IngredientAttrs {
  id: string;
  title: string;
  ingredientType: IngredientType;
  meal: MealDoc;
}

export interface IngredientDoc extends mongoose.Document {
  title: string;
  ingredientType: IngredientType;
  meal: MealDoc;
  version: number;
}

interface IngredientModel extends mongoose.Model<IngredientDoc> {
  build(attrs: IngredientAttrs): IngredientDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<IngredientDoc | null>;
}

const ingredientSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    ingredientType: {
      type: String,
      enum: Object.values(IngredientType),
      default: IngredientType.None,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Meal',
      required: false,
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

ingredientSchema.set('versionKey', 'version');
ingredientSchema.plugin(updateIfCurrentPlugin);

ingredientSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Ingredient.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ingredientSchema.statics.build = (attrs: IngredientAttrs) => {
  return new Ingredient({
    _id: attrs.id,
    title: attrs.title,
    ingredientType: attrs.ingredientType,
    meal: attrs.meal,
  });
};

const Ingredient = mongoose.model<IngredientDoc, IngredientModel>(
  'Ingredient',
  ingredientSchema
);

export { Ingredient };
