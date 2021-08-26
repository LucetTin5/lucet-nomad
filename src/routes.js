const ID_FORM = 'id([0-9a-z]{24})';

const tree = {
  ROOT: {
    root: '/',
    join: '/join',
    login: '/login',
    logout: '/logout',
    search: '/search',
  },
  USERS: {
    root: '/users',
    profile: `/:${ID_FORM}`,
    edit: `/edit`,
    changePassword: `/change-password`,
  },
  VIDEOS: {
    root: '/videos',
    watch: `/:${ID_FORM}`,
    upload: '/upload',
    edit: `/:${ID_FORM}/edit`,
    delete: `/:${ID_FORM}/delete`,
  },
  SOCIAL: {
    root: '/social',
    ghStart: '/gh/start',
    ghFinish: '/gh/finish',
  },
  APIS: {
    root: '/api',
    newComment: `/videos/:${ID_FORM}/new-comment`,
    editComment: `/comments/:${ID_FORM}/edit`,
    deleteComment: `/videos/:${ID_FORM}/delete-comment`,
    likeComment: `/comments/:${ID_FORM}/like-comment`,
    dislikeComment: `/comments/:${ID_FORM}/dislike-comment`,
    checkEmailAvailability: `/valid-email`,
  },
};

export default tree;
