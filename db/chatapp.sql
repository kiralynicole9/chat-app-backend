CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    img VARCHAR(1000),
    status VARCHAR(50),
    phone VARCHAR(50),
    active INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_users INTEGER,
    to_users INTEGER DEFAULT NULL,
    message TEXT NOT NULL,  
    has_been_read INTEGER DEFAULT 0,
    in_channel INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    id_message INTEGER REFERENCES messages(id),
    from_user INTEGER,
    to_user INTEGER DEFAULT NULL,
    has_been_read INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    channel_id INTEGER REFERENCES channels(id) DEFAULT NULL
);

CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE channel_members(
    user_id INTEGER REFERENCES users(id),
    channel_id INTEGER REFERENCES channels(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, channel_id)
);

CREATE TABLE channel_messages (
    channel_id INTEGER REFERENCES channels(id),
    message_id INTEGER REFERENCES messages(id),
    PRIMARY KEY (channel_id, message_id)
);
  