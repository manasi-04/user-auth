import { createClient } from 'redis';

let redisClient;

export const connectRedis = async () => {
	redisClient = createClient();
	redisClient.on('error', (error) => {
		console.log('error while connecting to redis', error);
		process.exit(1);
	});
	await redisClient.connect();
};

export const getRedisObj = async (key) => {
	if (!key) {
		return '';
	}
	const obj = await redisClient.get(key);
	return obj;
};

export const setRedis = async (key, val) => {
	const expiry = process.env.CACHE_DURATION_REDIS;
	await redisClient.SETEX(key, parseInt(expiry), val);
};

export const deleteKey = async (key) => {
	await redisClient.del(key);
};

export const getPartialMatchingKeys = async (key) => {
	const data = await redisClient.keys(`${key}*`);
	return data;
};
