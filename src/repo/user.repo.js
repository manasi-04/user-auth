export const checkEmailExists = 'SELECT * FROM users WHERE LOWER(email)=LOWER($1)';
export const insertUserData = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3)';
