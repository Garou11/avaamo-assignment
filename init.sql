SELECT 'CREATE DATABASE avaamo' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'avaamo');

\c avaamo;

CREATE SCHEMA IF NOT EXISTS docs;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS docs.user_documents (
    id SERIAL PRIMARY KEY,
    docid UUID DEFAULT uuid_generate_v4() NOT NULL,
    userid INTEGER NOT NULL,
    isactive BOOLEAN DEFAULT TRUE NOT NULL,
    size VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    CONSTRAINT user_documents_un1 UNIQUE (docid),
    CONSTRAINT user_documents_un2 UNIQUE (userid, isactive, filename)
);