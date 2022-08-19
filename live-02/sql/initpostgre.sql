-- postgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS api_user(
    uuid uuid DEFAULT uuid_generate_v4(),
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY (uuid)
);

INSERT INTO api_user (username, password) 
    VALUES ('Fernando', crypt('!q1w2e3r4$', 'my_salt'),
           ('Henrique', crypt('!q1w2e3r4$', 'my_salt'));


