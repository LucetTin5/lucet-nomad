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
import { videoUploader, loginOnly, deleteS3Video } from '../middlewares';
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
router
  .route(Videos.edit)
  .all(loginOnly)
  .get(getEdit)
  .post(videoUploader.single('thumb'), postEdit);
router.get(Videos.delete, loginOnly, deleteS3Video, deleteVideo);
export default router;
