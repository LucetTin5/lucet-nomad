import express from 'express';
import {
  addComment,
  editComment,
  deleteComment,
} from '../controllers/apiHandlers';
import routes from '../routes';

const Apis = routes.APIS;

const router = express.Router();

router.post(Apis.newComment, addComment);
router.post(Apis.editComment, editComment);
router.post(Apis.deleteComment, deleteComment);

export default router;
