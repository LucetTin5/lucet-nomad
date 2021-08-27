import multer from 'multer';
import Video from './models/Video';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const storage = (folder) => {
  return multerS3({
    s3,
    bucket: `lucet-wetube/${folder}`,
    acl: 'public-read',
  });
};

export const avatarUplaoder = multer({
  storage: storage('avatar'),
  limits: 2e7,
});
export const videoUploader = multer({
  storage: storage('video'),
  limits: 5e6,
});

export const globalVariables = (req, res, next) => {
  res.locals.siteName = 'LucetVideo';
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

const deleteParams = ({ folder, fileId }) => {
  return {
    Bucket: `${process.env.S3_NAME}/${folder}`,
    Key: fileId,
  };
};

export const deleteObject = (params) => {
  s3.deleteObject(deleteParams(params), (err, data) => {
    if (err) {
      console.log(err);
      throw Error(err);
    }
    console.log('S3 Object deleted', data);
  });
};
export const loginOnly = (req, res, next) => {
  if (!req.session.loggedIn) return res.status(401).redirect('/');
  next();
};
export const unknownOnly = (req, res, next) => {
  if (req.session.loggedIn) return res.status(401).redirect('/');
  next();
};
export const deleteS3Video = async (req, res, next) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const vidId = video.vidPath.toString().match(/[0-9a-z]+$/);
  const thumbId =
    video.thumbPath !== ''
      ? video.thumbPath.toString().match(/[0-9a-z]+$/)
      : '';
  await s3.deleteObject(
    {
      Bucket: 'lucet-wetube/video',
      Key: vidId[0],
    },
    (err, data) => {
      if (err) console.log('err:', err, err.stack);
      console.log('data: ', data);
    }
  );
  if (!thumbId.length) {
    await s3.deleteObject(
      {
        Bucket: 'lucet-wetube',
        Key: `/video/${thumbId[0]}`,
      },
      (err, data) => {
        if (err) console.log('err:', err, err.stack);
        console.log('data: ', data);
      }
    );
  }
  next();
};
