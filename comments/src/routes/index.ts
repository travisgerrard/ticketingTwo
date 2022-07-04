import express, { Request, Response } from 'express';
import { Comment } from '../models/comment';

const router = express.Router();

router.get('/api/comments/meal/:id', async (req: Request, res: Response) => {
  const comments = await Comment.find({ meal: req.params.id });

  res.send(comments);
});

export { router as indexCommentsRouter };
