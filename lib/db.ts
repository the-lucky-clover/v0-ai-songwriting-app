import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: number
  email: string | null
  created_at: Date
  is_adult: boolean
  theme: string
}

export type Collection = {
  id: number
  user_id: number | null
  name: string
  icon: string
  created_at: Date
  updated_at: Date
}

export type Lyric = {
  id: number
  user_id: number | null
  collection_id: number | null
  title: string
  content: string
  audio_tag: string | null
  musical_influence: string | null
  subject_matter: string | null
  created_at: Date
  updated_at: Date
}

export type LyricVersion = {
  id: number
  lyric_id: number
  version_number: number
  content: string
  note: string | null
  created_at: Date
}

export type AIGeneration = {
  id: number
  lyric_id: number
  subject_matter: string
  musical_influence: string | null
  influence_type: string | null
  song_title: string | null
  audio_tag: string | null
  verse_count: number
  bars_per_verse: number
  chorus_count: number
  generated_content: string | null
  created_at: Date
}
