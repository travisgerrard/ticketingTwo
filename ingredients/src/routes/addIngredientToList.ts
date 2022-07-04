import express, { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
} from '@tgticketing/common';
import { Ingredient } from '../models/ingredient';
import { natsWrapper } from '../nats-wrapper';
import { IngredientAddedToListPublisher } from '../events/publishers/ingredient-addto-list-publisher';

const router = express.Router();

router.post(
  '/api/ingredients/addIngredientToList/:id',
  requireAuth,
  async (req: Request, res: Response) => {
    const ingredient = await Ingredient.findById(req.params.id);

    if (!ingredient) {
      throw new NotFoundError();
    }

    new IngredientAddedToListPublisher(natsWrapper.client).publish({
      title: ingredient.title,
      meal: ingredient.meal?.id,
      ingredientType: ingredient.ingredientType,
      currentUser: req.currentUser!.id,
    });

    res.send(ingredient);
  }
);

export { router as addIngredientToListRouter };
