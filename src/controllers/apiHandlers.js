import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';

export const addComment = async (req, res) => {
  const {
    body: { text },
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const newComment = await Comment.create({
      text,
      writer: _id,
      where: id,
    });
    const video = await Video.findById(id);
    video.comments.push(newComment._id);
    video.save();
    return res.status(201).json({ id: newComment._id, writer: _id });
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
export const editComment = async (req, res) => {
  const {
    body: { text },
    params: { id },
  } = req;
  try {
    await Comment.findByIdAndUpdate(id, { text });
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
};
export const deleteComment = async (req, res) => {
  const {
    params: { id },
    body: { _id },
  } = req;
  console.log(_id);
  try {
    const video = await Video.findById(id);
    console.log(video);
    video.comments = video.coments.filter((cid) => String(cid) !== String(_id));
    // video.save();
    const comment = await Comment.findById(_id);
    console.log(comment);
    // await Comment.findByIdAndRemove(_id);
    return res.end();
  } catch (err) {
    return res.sendStatus(400);
  }
};
