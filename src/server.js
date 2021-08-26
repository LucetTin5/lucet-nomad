import express from 'express';
// middlewares
import morgan from 'morgan';
import session from 'express-session';
import routes from './routes';
import mongoose from 'mongoose';
import flash from 'express-flash';
import MongoStore from 'connect-mongo';

// routers
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import socialRouter from './routers/socialRouter';
import apiRouter from './routers/apiRouter';
import { globalVariables } from './middlewares';

const App = express();
const logger = morgan('dev');
// express setting + package middlewares
App.use(logger);
App.set('view engine', 'pug');
App.set('views', process.cwd() + '/src/views/');
App.use(express.urlencoded({ extended: true }));
App.use(express.json());
App.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: {
      maxAge: 1.728e8,
    },
    saveUninitialized: false,
    // HttpOnly: true,
    // secure: true,
    store: MongoStore.create({ client: mongoose.connection.client }),
  })
);
App.use(flash());
// custom middlewares
App.use(globalVariables);

// static folders
App.use('/static', express.static('static'));
App.use('/uploads', express.static('uploads'));
// routers
App.use(routes.ROOT.root, rootRouter);
App.use(routes.USERS.root, userRouter);
App.use(routes.VIDEOS.root, videoRouter);
App.use(routes.SOCIAL.root, socialRouter);
App.use(routes.APIS.root, apiRouter);

export default App;
