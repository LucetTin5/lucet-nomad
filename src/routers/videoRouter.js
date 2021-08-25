import express from 'express';
import routes from '../routes';

import {
  watch,
  getUpload,
  postUpload,
  getEdit,
  postEdit,
  deleteVideo,
} from '../controllers/videoController';
import { videoUploader, loginOnly } from '../middlewares';
const Videos = routes.VIDEOS;
const router = express.Router();

router.get(Videos.watch, watch);
router
  .route(Videos.upload)
  .all(loginOnly)
  .get(getUpload)
  .post(
    videoUploader.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumb', maxCount: 1 },
    ]),
    postUpload
  );
router.route(Videos.edit).all(loginOnly).get(getEdit).post(postEdit);
router.get(Videos.delete, loginOnly, deleteVideo);
export default router;
