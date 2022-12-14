import { EMAIL_REGEX, NEWS_URL, PASSWORD_REGEX, TOP_HEADLINES } from '../constants.js';
import { pool } from '../index.js';
import { constructUrl, convertingResponse, validateData } from '../helpers.js';
import { checkEmailExists, insertUserData } from '../repo/user.repo.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { deleteKey, getPartialMatchingKeys, getRedisObj, setRedis } from '../cache/redis.js';
import axios from 'axios';

export const signupHandler = async (req, res) => {
	try {
		const { email, password, name } = req.body;
		const validEntries = validateData(email, password, name);
		if (validEntries) {
			const passwordValid = password.match(PASSWORD_REGEX);
			const emailValid = email.match(EMAIL_REGEX);

			if (passwordValid && emailValid) {
				const client = await pool.connect();
				const emailExists = await client.query(checkEmailExists, [email]);
				if (emailExists.rows.length > 0) {
					res.status(400).json({ message: 'Email already exists.' });
				} else {
					const saltRounds = 10;
					const hashedPass = await bcrypt.hash(password, saltRounds);
					if (hashedPass) {
						await client.query(insertUserData, [name, email.toLowerCase(), hashedPass]);
						res.status(200).json({message: 'user added successfully'});
					}
				}
			} else {
				res.status(400).json({ message: 'Please enter valid email and password. Password must be minimum eight characters, at least one uppercase letter, one lowercase letter and one number.' });
			}
		} else {
			res.status(400).json({ message: 'Body should have password, email and name fields.' });
		}
	} catch (err) {
		res.status(400).json(err.message);
	}
};

export const loginHandler = async (req, res) => {
	try {
		const { email, password } = req.body;
		const validEntries = validateData(email, password);
		if (validEntries) {
			const client = await pool.connect();
			const emailExists = await client.query(checkEmailExists, [email]);
			if (emailExists.rows.length === 1) {
				const matches = await bcrypt.compare(password, emailExists.rows[0].password);
				if (matches) {
					const token = uuidv4();
					const loginToken = 'user-' + token;
					await setRedis(loginToken, JSON.stringify({
						id: emailExists.rows[0].id,
						email
					}));
					res.status(200).json({ token: loginToken, message: 'Logged in successfully.' });
				} else {
					res.status(400).json({ message: 'Invalid credentials.' });
				}
			} else {
				res.status(200).json({ message: 'Please enter valid credentials.' });
			}
		} else {
			res.status(400).json({ message: 'Body should have password and email fields.' });
		}
	} catch (err) {
		res.status(400).json(err.message);
	}
};

export const logoutHandler = async (req, res) => {
	try {
		const authToken = req.headers.authorization;
		const val = await getRedisObj(authToken);
		if (val) {
			await deleteKey(authToken);
			res.status(200).json({ message: 'Logged out successfully.' });
		} else {
			res.status(400).json({ message: 'unauthorized or session expired' });
		}
	} catch (err) {
		res.status(400).json(err.message);
	}
};

export const newsHandler = async (req, res) => {
	try {
		const authToken = req.headers.authorization;
		const val = await getRedisObj(authToken);
		if (val) {
			const searchTerm = req.query.search;
			let result;
			const cachedData = await getPartialMatchingKeys(`news-${searchTerm}`);
			if (cachedData.length === 0) {
				const url = constructUrl(searchTerm, NEWS_URL);
				const resp = await axios.get(url, {
					headers: { 'Accept-Encoding': 'gzip,deflate,compress' }
				});
				result = convertingResponse(resp.data);
				setRedis(`news-${searchTerm}`, JSON.stringify(result));
			} else {
				const data = await getRedisObj(cachedData[0]);
				result = JSON.parse(data);
			}
			res.status(200).json(result);
		} else {
			res.status(400).json({ message: 'unauthorized or session expired' });
		}
	} catch (err) {
		const error = (err.response && err.response.data && err.response.data.message) || err.message;
		res.status(400).json(error);
	}
};

export const topHeadlineshandler = async (req, res) => {
	try {
		const authToken = req.headers.authorization;
		const val = await getRedisObj(authToken);
		if (val) {
			const searchTerm = req.query.search;
			let result;
			const cachedData = await getPartialMatchingKeys(`top-headlines-${searchTerm}`);
			if (cachedData.length === 0) {
				const url = constructUrl(searchTerm, TOP_HEADLINES);
				const resp = await axios.get(url, {
					headers: { 'Accept-Encoding': 'gzip,deflate,compress' }
				});
				result = convertingResponse(resp.data);
				setRedis(`top-headlines-${searchTerm}`, JSON.stringify(result));
			} else {
				const data = await getRedisObj(cachedData[0]);
				result = JSON.parse(data);
			}
			res.status(200).json(result);
		} else {
			res.status(400).json({ message: 'unauthorized or session expired' });
		}
	} catch (err) {
		const error = (err.response && err.response.data && err.response.data.message) || err.message;
		res.status(400).json(error);
	}
};
