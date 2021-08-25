import mongoose from 'mongoose';

const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

const DB = mongoose.connection;

DB.once('open', () => console.log('✅ DB connected'));
DB.on('error', (error) => console.log('❌ DB Error: ', error));
