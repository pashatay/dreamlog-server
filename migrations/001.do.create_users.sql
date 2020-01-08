DROP TABLE IF EXISTS users

CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, 
    verified BOOLEAN DEFAULT false NOT NULL,
    verification_code TEXT
)