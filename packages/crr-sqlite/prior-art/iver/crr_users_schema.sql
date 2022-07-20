DROP TABLE IF EXISTS crr_users;
CREATE TABLE crr_users(
  uuid blob PRIMARY KEY,
	first_name text NOT NULL,
  crr_first_name integer,
	last_name text NOT NULL,
  crr_last_name integer,
	phone text NOT NULL,
  crr_phone integer,
	email text NOT NULL,
  crr_email integer,
  crr_cl integer DEFAULT 1
);
