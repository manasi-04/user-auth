# user-auth
This repo includes user authorization and fetching data from news API and sending the desired response to users.

Steps to setup
1. Install postgres(windows)
    Link -> https://www.postgresql.org/download/windows/
2. Install redis (windows)
    Link -> https://developer.redis.com/create/windows/
3. Clone the repo.
4. Run npm install in the root folder
5. Run this query in your pgAdmin or through command shell
    For command shell check for the commands to execute the query.
    
	DROP TABLE IF EXISTS users;
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR DEFAULT '',
    created_date TIMESTAMP WITHOUT TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL,
    updated_date TIMESTAMP WITHOUT TIME ZONE DEFAULT TIMEZONE('utc', now()) NOT NULL
  );
6. Go to https://newsapi.org/ url and generate an API key and add it in the .env file.
7. Fill all the values in .env file
8. Start redis-server using redis-cli command
9. Run npm start to start the server.
10. Hit the API endpoints from postman and get the desired response.
