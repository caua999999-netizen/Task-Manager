import { Router } from 'express';
import {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', listProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;