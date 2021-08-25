import multer from 'multer';
import Video from './models/Video';
import fs from 'fs';

export const globalVariables = (req, res, next) => {
  res.locals.siteName = 'LucetVideo';
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};
export const videoUploader = multer({
  dest: './uploads/videos',
  limits: 2e7,
});
export const avatarUplaoder = multer({
  dest: './uploads/avatar',
  limits: 5e6,
});
export const loginOnly = (req, res, next) => {
  if (!res.locals.loggedIn) return res.status(401).redirect('/');
  next();
};
export const unknownOnly = (req, res, next) => {
  if (res.locals.loggedIn) return res.status(401).redirect('/');
  next();
};
export const deleteLocalVideo = async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  fs.unlink(`/uploads/videos/${id}`, (err) => console.log(err));
  fs.unlink(`/uploads/videos/${video.thumbPath}`, (err) => console.log(err));
  next();
};
