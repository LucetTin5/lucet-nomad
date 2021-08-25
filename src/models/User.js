import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  avatarUrl: String,
  socialOnly: { type: Boolean, required: true, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  username: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hashSync(this.password, 5);
  }
});

const Model = mongoose.model('User', UserSchema);

export default Model;
