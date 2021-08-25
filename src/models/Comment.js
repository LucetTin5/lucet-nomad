import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  writer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  where: { type: mongoose.Schema.Types.ObjectId, required: true, req: 'Video' },
  createdAt: { type: Date, requrired: true, default: Date.now },
  meta: {
    likes: { type: Number, required: true, default: 0 },
    likeUser: [{ type: mongoose.Schema.Types.ObjectId }],
    dislikes: { type: Number, required: true, default: 0 },
    dislikeUser: [{ type: mongoose.Schema.Types.ObjectId }],
  },
});

const Model = mongoose.model('Comment', CommentSchema);

export default Model;
