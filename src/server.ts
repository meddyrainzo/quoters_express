import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

import { serverConfig, logger, dbConfig } from './config';
import commentRouter from './modules/comments/routes/comments.routes';
import identityRouter from './modules/identity/routes/identity.routes';
import quoteRouter from './modules/quote/routes/quote.routes';

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
const { port } = serverConfig;

(async () => {
  const { db_host, db_name, db_user, db_password } = dbConfig;
  logger.info('Attempting to connect');
  try {
    const connectionString = `mongodb://${db_user}:${db_password}@${db_host}/${db_name}`;
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    server.listen(port, () =>
      logger.info(`Server running on port:: ${port}...`)
    );
    server.emit('listening');
  } catch (err) {
    logger.error('Failed to connect to the database', { error_message: err });
    process.exit(1);
  }
})();

server.use('/identity', identityRouter);
server.use('/quotes', quoteRouter);
server.use('/comments', commentRouter);

export default server;
