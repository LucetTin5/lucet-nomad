const ID_FORM = 'id([0-9a-z]{24})';

const tree = {
  ROOT: {
    root: '/',
    join: '/join',
    login: '/login',
    logout: '/logout',
    search: '/search',
    // delete: '/delete-account',
  },
  USERS: {
    root: '/users',
    profile: `/:${ID_FORM}`,
    edit: `/:${ID_FORM}/edit`,
    changePassword: `/:${ID_FORM}/change-password`,
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
  },
};

export default tree;
