-- Lyrical.top Database Schema

-- Users table for future auth
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_adult BOOLEAN DEFAULT false,
  theme VARCHAR(50) DEFAULT 'minimal'
);

-- Collections (folders for organizing lyrics)
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50) DEFAULT 'folder',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lyrics (song files)
CREATE TABLE IF NOT EXISTS lyrics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'Untitled Draft',
  content TEXT DEFAULT '',
  audio_tag VARCHAR(255),
  musical_influence VARCHAR(255),
  subject_matter TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Version history for lyrics
CREATE TABLE IF NOT EXISTS lyric_versions (
  id SERIAL PRIMARY KEY,
  lyric_id INTEGER REFERENCES lyrics(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI generation history
CREATE TABLE IF NOT EXISTS ai_generations (
  id SERIAL PRIMARY KEY,
  lyric_id INTEGER REFERENCES lyrics(id) ON DELETE CASCADE,
  subject_matter TEXT NOT NULL,
  musical_influence VARCHAR(255),
  influence_type VARCHAR(50),
  song_title VARCHAR(255),
  audio_tag VARCHAR(255),
  verse_count INTEGER DEFAULT 2,
  bars_per_verse INTEGER DEFAULT 16,
  chorus_count INTEGER DEFAULT 3,
  generated_content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lyrics_user ON lyrics(user_id);
CREATE INDEX IF NOT EXISTS idx_lyrics_collection ON lyrics(collection_id);
CREATE INDEX IF NOT EXISTS idx_versions_lyric ON lyric_versions(lyric_id);
CREATE INDEX IF NOT EXISTS idx_generations_lyric ON ai_generations(lyric_id);
