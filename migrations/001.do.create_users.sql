CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullname TEXT NOT NULL,
  username TEXT NOT NULL,
  password VARCHAR NOT NULL,
  employer BOOLEAN DEFAULT FALSE
);