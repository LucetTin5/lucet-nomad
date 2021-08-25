import express from 'express';
import routes from '../routes';

import { startGHAuth, finishGHAuth } from '../controllers/socialAuth';

const Social = routes.SOCIAL;
const Router = express.Router();

Router.get(Social.ghStart, startGHAuth);
Router.get(Social.ghFinish, finishGHAuth);

export default Router;
