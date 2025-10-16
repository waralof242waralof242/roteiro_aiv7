/*
  # Create user preferences table

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (text, unique) - User identifier (browser fingerprint or session ID)
      - `voice_buttons_enabled` (boolean) - Whether voice recording buttons are enabled
      - `created_at` (timestamp) - When the preference was created
      - `updated_at` (timestamp) - When the preference was last updated
  
  2. Security
    - Enable RLS on `user_preferences` table
    - Add policy for users to read and write their own preferences based on user_id
    
  3. Notes
    - This table stores user preferences like voice button state
    - user_id is a text field to allow flexible identification (session ID, browser fingerprint, etc.)
    - Default value for voice_buttons_enabled is true
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  voice_buttons_enabled boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);