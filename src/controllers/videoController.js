import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';

export const getHome = async (req, res) => {
  try {
    const videos = await Video.find({}).populate('uploader');
    if (videos === {}) {
      throw Error('No Videos');
    }
    return res
      .status(200)
      .render('./screen/home', { pageTitle: 'Home', videos });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .render('./screen/home', { pageTitle: 'Home', videos: {} });
  }
};
export const getUpload = (req, res) =>
  res.render('./screen/videos/upload', { pageTitle: 'Upload Video' });
export const postUpload = async (req, res) => {
  const {
    files: { video, thumb },
    body: { title, description, tags },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const newVid = await Video.create({
      title,
      vidPath: video[0].location,
      thumbPath: thumb ? thumb[0].location : '',
      description,
      tags: await Video.formatTags(tags),
      uploader: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVid._id);
    user.save();
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/videos/upload');
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id).populate([
      'uploader',
      {
        path: 'comments',
        populate: {
          path: 'writer',
          model: 'User',
        },
      },
    ]);
    return res.render('./screen/videos/watch', {
      pageTitle: 'Watch ' + video.title,
      video,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).redirect('/');
  }
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    return res.render('./screen/videos/edit', {
      pageTitle: `Edit ${video.title}`,
      video,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).redirect(`/videos/${id}`);
  }
};
export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, tags },
    file,
  } = req;
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      tags: await Video.formatTags(tags),
      thumbPath: file.location,
    });
    return res.redirect(`/videos/${id}`);
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/videos/${id}/edit`);
  }
};

export const search = async (req, res) => {
  const {
    query: { option, keyword },
  } = req;
  if (!option && !keyword)
    return res.render('./screen/videos/search', { pageTitle: 'Search' });
  try {
    const regex = new RegExp(keyword, 'gi');
    let videos;
    switch (option) {
      case 'title':
        videos = await Video.find({ title: { $regex: regex } }).populate(
          'uploader'
        );
        break;
      case 'tags':
        videos = await Video.find({ tags: { $regex: regex } }).populate(
          'uploader'
        );
        break;
    }
    return res.render('./screen/videos/search', {
      pageTitle: 'Result',
      videos,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .render('./screen/videos/search', { pageTitle: 'Nothing Found' });
  }
};
export const deleteVideo = async (req, res) => {
  const {
    parmas: { id },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const video = await Video.findById(id).populate('comments');
    if (String(video.uploader) !== _id) {
      req.flash('err', `You're not uploader of this video`);
      return res.status(401).redirect(`/videos/${id}`);
    }
    const uploader = await User.findById(video.uploader);
    uploader.videos = uploader.videos.filter((vid) => String(vid) !== id);
    uploader.save();
    const comments = video.comments;
    if (!comments.length) {
      for (cid in comments) {
        await Comment.findByIdAndRemove(cid, {}, (err) => console.log(err));
      }
    } else {
      console.log('No comment');
    }
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/videos/${id}`);
  }
};
