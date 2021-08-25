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
    profile: '/:id([0-9a-z]{24})',
    edit: '/:id([0-9a-z]{24})/edit',
    changePassword: '/:id([0-9a-z]{24})/change-password',
  },
  VIDEOS: {
    root: '/videos',
    watch: '/:id([0-9a-z]{24})',
    upload: '/upload',
    edit: '/:id([0-9a-z]{24})/edit',
    delete: '/:id([0-9a-z]{24})/delete',
  },
  SOCIAL: {
    root: '/social',
    ghStart: '/gh/start',
    ghFinish: '/gh/finish',
  },
  APIS: {},
};

export default tree;
