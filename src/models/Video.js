import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  vidPath: { type: String, required: true },
  thumbPath: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },
  // model links
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

VideoSchema.static('formatTags', (tags) =>
  tags.split(',').map((tag) => tag.trim())
);

const Model = mongoose.model('Video', VideoSchema);

export default Model;
