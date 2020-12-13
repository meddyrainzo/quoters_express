import dotenv from 'dotenv';
import path from 'path';

dotenv.config( { path: path.join(__dirname, '.env') });

export { default as serverConfig } from './server.config';
export { default as logger } from './logger';
export { default as dbConfig } from './db.config';
export { default as jwtConfig } from './jwt.config';
export { default as swaggerConfig } from './swagger.config';