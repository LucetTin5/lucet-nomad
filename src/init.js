import 'regenerator-runtime/runtime';
import './database';
import './models/User';
import './models/Video';
import './models/Comment';
import app from './server';

const PORT = process.env.PORT;

app.listen(PORT, () => console.log('✅ Server Connected at PORT  ', PORT));
