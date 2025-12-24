import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

// User routes
router.post('/', userController.createUser.bind(userController));
router.get('/', userController.listUsers.bind(userController));
router.get('/profile', userController.getProfile.bind(userController));
router.get('/:id', userController.getProfile.bind(userController));
router.put('/:id', userController.updateUser.bind(userController));
router.delete('/:id', userController.archiveUser.bind(userController));

// Auth routes
router.post('/login', userController.login.bind(userController));
router.post('/signout', userController.signout.bind(userController));

export default router;

