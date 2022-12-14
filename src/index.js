import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { router } from './routes/http.js';
import { connectRedis } from './cache/redis.js';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

export const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT
});
connectRedis();

const port = process.env.PORT;
app.listen(port, () => console.log('server is up and running on PORT: ', port));
