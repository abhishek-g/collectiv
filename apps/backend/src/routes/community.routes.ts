import { Router } from 'express';
import communityController from '../controllers/community.controller';

const router = Router();

// Communities
router.post('/', communityController.create);
router.get('/', communityController.list);
router.get('/:id', communityController.getById);
router.put('/:id', communityController.update);
router.delete('/:id', communityController.remove);

// Members
router.post('/:id/members', communityController.addMember);
router.delete('/:id/members/:userId', communityController.removeMember);

export default router;

