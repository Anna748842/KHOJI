CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal VARCHAR(300) NOT NULL,
    level VARCHAR(30) NOT NULL,
    budget VARCHAR(30) NOT NULL,
    hours_per_week INTEGER NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS roadmaps_goal_idx
ON roadmaps USING gin (to_tsvector('english', goal));