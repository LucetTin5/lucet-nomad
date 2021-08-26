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
  try {
    const video = await Video.findById(id);
    video.comments = video.comments.filter((cid) => String(cid) !== _id);
    video.save();
    const comment = await Comment.findById(_id);
    await Comment.findByIdAndRemove(_id);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
};
// like / dislike 전환을 프론트에서 전송하지 않도록 설정하였으나
// 혹시 모르기에 설정 -> 추후 수정 요망
export const likeComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  try {
    // 작성자와 액션을 취한 자는 서로 다른 이일 것
    if (String(user._id) === id) {
      return res.sendStatus(401);
    }
    const comment = await Comment.findById(id);
    // 이미 액션을 취한 사람인지 확인
    const likes = comment.meta.likeUser;
    const dislikes = comment.meta.dislikeUser;
    // 둘 중 한군데만 존재하거나 양쪽 모두에 없어야 한다.
    const chkLike = likes.some((uid) => uid === user._id);
    const chkDislike = dislikes.some((uid) => uid === user._id);
    if (chkLike) {
      // 이미 좋아요 상태 -> 수를 늘리지 아니함
      return res.sendStatus(200);
    }
    if (chkDislike) {
      // 싫어요 -> 좋아요
      comment.meta.dislikeUser = dislikes.filter((uid) => uid !== user._id);
      comment.meta.likeUser.push(user._id);
      comment.meta.dislike -= 1;
      comment.meta.like += 1;
      comment.save();
      return res.sendStatus(200);
    }
    if (!chkLike && !chkDislike) {
      // 아직 선택을 하지 아니함 -> 좋아요 선택
      comment.meta.likeUser.push(user._id);
      comment.meta.like += 1;
      comment.save();
      return res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
};
export const dislikeComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  try {
    if (String(user._id) === id) {
      return res.sendStatus(401);
    }
    const comment = await Comment.findById(id);
    const likes = comment.meta.likeUser;
    const dislikes = comment.meta.dislikeUser;
    const chkLike = likes.some((uid) => uid === user._id);
    const chkDislike = dislikes.some((uid) => uid === user._id);
    if (chkDislike) {
      // 이미 싫어요 상태 -> 수를 늘리지 아니함
      return res.sendStatus(200);
    }
    if (chkLike) {
      // 좋아요 -> 싫어요
      comment.meta.likeUser = likes.filter((uid) => uid !== user._id);
      comment.meta.dislikeUser.push(user._id);
      comment.meta.like -= 1;
      comment.meta.dislike += 1;
      comment.save();
      return res.sendStatus(200);
    }
    if (!chkLike && !chkDislike) {
      // 아직 선택을 하지 아니함 -> 싫어요 선택
      comment.meta.dislikeUser.push(user._id);
      comment.meta.dislike += 1;
      comment.save();
      return res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
};
export const emailAvailability = async (req, res) => {
  // email validation regex
  // https://emailregex.com/
  const RFC5322 = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  const { email } = req.query;
  if (!email.match(RFC5322)) {
    return res.sendStatus(400);
  }
  try {
    const regex = new RegExp(email, 'gi');
    const checker = await User.exists({ email: regex });
    if (!checker) {
      return res.sendStatus(200);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};
const addView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  video.meta.views += 1;
  video.save();
  return res.sendStatus(200);
};
