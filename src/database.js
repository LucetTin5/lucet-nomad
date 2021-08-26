import mongoose from 'mongoose';

const DB_URL = process.env.DB_URL;

export const clientPromise = mongoose
  .connect(DB_URL, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .catch((error) => console.log(error))
  .then((con) => con.connection.getClient());

const DB = mongoose.connection;

DB.once('open', () => console.log('✅ DB connected'));
DB.on('error', (error) => console.log('❌ DB Error: ', error));
