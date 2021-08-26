import express from 'express';
import {
  addComment,
  editComment,
  deleteComment,
  likeComment,
  dislikeComment,
  emailAvailability,
} from '../controllers/apiHandlers';
import routes from '../routes';

const Apis = routes.APIS;

const router = express.Router();

router.post(Apis.newComment, addComment);
router.post(Apis.editComment, editComment);
router.post(Apis.deleteComment, deleteComment);
router.post(Apis.likeComment, likeComment);
router.post(Apis.dislikeComment, dislikeComment);
router.get(Apis.checkEmailAvailability, emailAvailability);

export default router;
