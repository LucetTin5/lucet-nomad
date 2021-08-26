import { deleteObject } from '../middlewares';

// login, join, logout, change PW 제외
export const profile = (req, res) =>
  res.render('./screen/users/profile', { pageTitle: 'My Profile' });
export const getEdit = (req, res) =>
  res.render('./screen/users/edit', { pageTitle: 'Edit My Profile' });
export const postEdit = async (req, res) => {
  const {
    body: { username },
    file,
    session: { user },
  } = req;
  try {
    if (user.avatarUrl) {
      deleteObject({
        folder: 'avatar',
        fileId: user.avatarUrl.toString().match(/[0-9a-z]+$/),
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatarUrl: file.location, username },
      { new: true }
    );
    req.session.loggedInUser = updatedUser;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/users/edit');
  }
};
