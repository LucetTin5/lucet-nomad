import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';

export const getHome = async (req, res) => {
  try {
    const videos = await Video.find({});
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
      pageTitle: video.title,
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
  } = req;
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      tags: await Video.formatTags(tags),
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
        videos = await Video.find({ title: regex });
        break;
      case 'tags':
        videos = await Video.find({ tags: regex });
        break;
      case 'uploader':
        videos = await Video.find({ uploader: regex });
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
  const { id } = req.params;
  try {
    const video = await Video.findById(id).populate(['uploader', 'comments']);
    const { _id } = video.uploader;
    const uploader = await User.findById(_id);
    uploader.videos = uploader.videos.filter(
      (vidId) => String(vidId) !== String(id)
    );
    uploader.save();
    if (video.comments.length > 0) {
      for (let i = 0; i < video.comments.length; i++) {
        await Comment.findByIdAndDelete(video.comments[i]._id);
      }
    }
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/videos/${id}`);
  }
};
