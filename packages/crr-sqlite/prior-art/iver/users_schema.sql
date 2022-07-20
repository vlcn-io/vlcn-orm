DROP TABLE IF EXISTS users;
CREATE TABLE users (
  uuid blob PRIMARY KEY,
	first_name text NOT NULL,
	last_name text NOT NULL,
	phone text NOT NULL,
	email text NOT NULL
);
