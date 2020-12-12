import express from 'express';
import helmet from 'helmet';
import serverConfig from './config/serverConfig';
import logger from './config/logger';

const server = express();
const { port } = serverConfig;

server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.listen(port, () => logger.info("Server running..."));