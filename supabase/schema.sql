-- Parrhesia Database Schema
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  reputation INTEGER DEFAULT 0,
  debates_won INTEGER DEFAULT 0,
  debates_lost INTEGER DEFAULT 0,
  total_debates INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debates table
CREATE TABLE IF NOT EXISTS debates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  creator_address TEXT NOT NULL,
  challenger_address TEXT,
  stake NUMERIC(20, 6) NOT NULL,
  status TEXT DEFAULT 'pending',
  winner TEXT,
  ai_judge_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  finalized_at TIMESTAMPTZ
);

-- Arguments table
CREATE TABLE IF NOT EXISTS arguments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  side TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  sources TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE,
  user_address TEXT NOT NULL,
  winner TEXT NOT NULL,
  argument_quality NUMERIC(3, 1),
  rebuttal_strength NUMERIC(3, 1),
  clarity NUMERIC(3, 1),
  evidence NUMERIC(3, 1),
  persuasiveness NUMERIC(3, 1),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(debate_id, user_address)
);

-- User badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  token_id TEXT,
  UNIQUE(user_address, badge_type)
);

-- Moderation results table
CREATE TABLE IF NOT EXISTS moderation_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id TEXT NOT NULL,
  user_address TEXT NOT NULL,
  content TEXT NOT NULL,
  is_appropriate BOOLEAN NOT NULL,
  violations TEXT[],
  severity TEXT,
  action TEXT NOT NULL,
  confidence NUMERIC(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content flags table
CREATE TABLE IF NOT EXISTS content_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation appeals table
CREATE TABLE IF NOT EXISTS moderation_appeals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  moderation_result_id UUID REFERENCES moderation_results(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewer_notes TEXT
);

-- User warnings table
CREATE TABLE IF NOT EXISTS user_warnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_address TEXT NOT NULL,
  violation_type TEXT NOT NULL,
  content_id TEXT,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT false,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI judge verdicts table
CREATE TABLE IF NOT EXISTS ai_judge_verdicts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE UNIQUE,
  winner TEXT NOT NULL,
  creator_score NUMERIC(3, 1),
  challenger_score NUMERIC(3, 1),
  reasoning TEXT,
  confidence NUMERIC(3, 2),
  judged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_debates_creator ON debates(creator_address);
CREATE INDEX IF NOT EXISTS idx_debates_challenger ON debates(challenger_address);
CREATE INDEX IF NOT EXISTS idx_debates_status ON debates(status);
CREATE INDEX IF NOT EXISTS idx_arguments_debate ON arguments(debate_id);
CREATE INDEX IF NOT EXISTS idx_votes_debate ON votes(debate_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_address ON user_badges(user_address);
CREATE INDEX IF NOT EXISTS idx_moderation_user ON moderation_results(user_address);
CREATE INDEX IF NOT EXISTS idx_flags_status ON content_flags(status);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public debates read" ON debates FOR SELECT USING (true);
CREATE POLICY "Public arguments read" ON arguments FOR SELECT USING (true);
CREATE POLICY "Public votes read" ON votes FOR SELECT USING (true);
CREATE POLICY "Public users read" ON users FOR SELECT USING (true);
CREATE POLICY "Public badges read" ON user_badges FOR SELECT USING (true);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
