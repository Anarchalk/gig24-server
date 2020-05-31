DROP TABLE IF EXISTS jobs;

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  pay NUMERIC NOT NULL,
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  term TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);