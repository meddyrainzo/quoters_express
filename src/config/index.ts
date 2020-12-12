import dotenv from 'dotenv';
import path from 'path';

dotenv.config( { path: path.join(__dirname, '.env') });

export { default as serverConfig } from './serverConfig';
export { default as logger } from './logger';
export { default as dbConfig } from './dbConfig';
export { default as jwtConfig } from './jwtConfig';