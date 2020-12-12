import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { serverConfig, logger, dbConfig } from './config';

const server = express();
const { port } = serverConfig;
const { db_host, db_user, db_password } = dbConfig;

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

logger.info('Attempting to connect');

(async () => {
    try {
        const connectionString = `mongodb://${db_user}:${db_password}@${db_host}`;
        await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
        server.listen(port, () => logger.info(`Server running on port:: ${port}...`));
    } catch (err) {
        logger.error('Failed to connect to the database', { error_message : err });
        process.exit(1);
    }
})();


export default server;