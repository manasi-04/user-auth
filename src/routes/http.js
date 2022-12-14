import express from 'express';
import { loginHandler, logoutHandler, signupHandler, newsHandler, topHeadlineshandler } from '../controllers/users.js';

export const router = express.Router();

router.post('/signup', signupHandler);

router.post('/login', loginHandler);

router.get('/logout', logoutHandler);

router.get('/news/all', newsHandler);

router.get('/news/top-headlines', topHeadlineshandler);
