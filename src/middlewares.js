import multer from 'multer';

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
