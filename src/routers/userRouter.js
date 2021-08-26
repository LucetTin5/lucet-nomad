import express from 'express';
import {
  getChangePassword,
  postChangePassword,
} from '../controllers/userAuths';
import { profile, getEdit, postEdit } from '../controllers/userPages';
import { avatarUplaoder, loginOnly } from '../middlewares';
import routes from '../routes';

const Users = routes.USERS;

const router = express.Router();

router.get(Users.profile, profile);
router
  .route(Users.edit)
  .all(loginOnly)
  .get(getEdit)
  .post(avatarUplaoder.single('avatar'), postEdit);
router
  .route(Users.changePassword)
  .all(loginOnly)
  .get(getChangePassword)
  .post(postChangePassword);

export default router;
