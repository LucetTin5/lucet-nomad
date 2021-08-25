import User from '../models/User';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) =>
  res.render('./screen/users/join', { pageTitle: 'Join' });
export const postJoin = async (req, res) => {
  const {
    body: { email, username, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash('error', 'Password confirmation does not match.');
    return res.status(400).redirect('/login');
  }
  try {
    const newUser = await User.create({
      email,
      password,
      username,
    });
    console.log(newUser);
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/login');
  }
};
export const getLogin = (req, res) =>
  res.render('./screen/users/login', { pageTitle: 'Login' });
export const postLogin = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Email not found');
      return res.status(404).redirect('/login');
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      req.flash('error', 'Wrong password');
      return res.status(400).redirect('/login');
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(404).redirect('/login');
  }
};
export const logout = (req, res) => {
  req.flash('info', `Bye ${req.session.user.username}!`);
  req.session.destroy();
  return res.redirect('/');
};
