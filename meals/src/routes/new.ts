import { requireAuth, validateRequest } from '@tgticketing/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { MealCreatedPublisher } from '../events/publishers/meal-created-publisher';
import { Meal } from '../models/meals';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/meals',
  requireAuth,
  [body('title').not().isEmpty().withMessage('Title is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, whereToFind, imageUrl, mealType } = req.body;

    const meal = Meal.build({
      title,
      whereToFind,
      imageUrl,
      mealType,
      creatorId: req.currentUser!.id,
    });
    await meal.save();

    new MealCreatedPublisher(natsWrapper.client).publish({
      id: meal.id,
      version: meal.version,
      title: meal.title,
    });

    res.status(201).send(meal);
  }
);

export { router as createMealRouter };
