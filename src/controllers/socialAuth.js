import User from '../models/User';
import fetch from 'node-fetch';

export const startGHAuth = (req, res) => {
  const startUrl = 'https://github.com/login/oauth/authorize';
  const options = {
    client_id: process.env.GH_CLIENT,
    scope: 'read:user user:email',
    allow_signup: false,
  };
  const params = new URLSearchParams(options).toString();
  const toGo = `${startUrl}?${params}`;
  return res.redirect(toGo);
};
export const finishGHAuth = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const options = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(options).toString();
  const postUrl = `${baseUrl}?${params}`;
  try {
    const response = await (
      await fetch(postUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })
    ).json();
    if (!response.access_token) {
      throw Error('No token received');
    } else {
      const apiUrl = 'https://api.github.com/';
      const { access_token: token } = response;
      const options = {
        method: 'GET',
        headers: {
          Authorization: `token ${token}`,
        },
      };
      const userData = await (await fetch(`${apiUrl}user`, options)).json();
      const emailData = await (
        await fetch(`${apiUrl}user/emails`, options)
      ).json();
      const emailObj = emailData.find((obj) => obj.primary && obj.verified);
      if (!emailObj) {
        req.flash('error', 'No primary email found');
        return res.status(400).redirect('/login');
      }
      const email = emailObj.email;
      const user = await User.findOne({ email });
      if (user) {
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash('info', `Hello ${user.username}`);
        return res.redirect('/');
      }
      const { avatar_url: avatarUrl, name, login } = userData;
      const socialUser = await User.create({
        avatarUrl,
        email,
        socialOnly: true,
        username:
          name || login || `GH_${Date.valueOf().toString().slice(0, 7)}`,
      });
      req.session.loggedIn = true;
      req.session.user = socialUser;
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/login');
  }
};
