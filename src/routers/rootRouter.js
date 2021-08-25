import express from 'express';

import routes from '../routes';

import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from '../controllers/userAuths';
import { getHome, search } from '../controllers/videoController';
import { loginOnly, unknownOnly } from '../middlewares';
const Root = routes.ROOT;

const router = express.Router();

router.get(Root.root, getHome);
router.route(Root.join).all(unknownOnly).get(getJoin).post(postJoin);
router.route(Root.login).all(unknownOnly).get(getLogin).post(postLogin);
router.get(Root.logout, loginOnly, logout);
router.get(Root.search, search);

export default router;
