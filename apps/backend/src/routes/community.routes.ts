import { Router } from 'express';
import communityController from '../controllers/community.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Communities
router.get('/', communityController.list); // public
router.get('/:id', communityController.getById); // public
router.post('/', authMiddleware, communityController.create);
router.put('/:id', authMiddleware, communityController.update);
router.delete('/:id', authMiddleware, communityController.remove);
router.post('/:id/image', authMiddleware, ...communityController.uploadImage);

// Members
router.post('/:id/members', authMiddleware, communityController.addMember);
router.delete('/:id/members/:userId', authMiddleware, communityController.removeMember);

export default router;

