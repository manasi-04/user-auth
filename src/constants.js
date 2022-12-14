/* eslint-disable no-useless-escape */
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const NEWS = 'https://newsapi.org/v2';
export const NEWS_URL = `${NEWS}/everything`;
export const TOP_HEADLINES = `${NEWS}/top-headlines`;
