CREATE TABLE flp_user (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  email TEXT NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE flp_clients(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    user_id INTEGER REFERENCES flp_user(id) ON DELETE CASCADE NOT NULL 
);
