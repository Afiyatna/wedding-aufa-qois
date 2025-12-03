/*
  # Wedding Invitation Database Schema

  1. New Tables
    - `rsvp_responses`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, optional)
      - `phone` (text, optional)
      - `attendance` (text, required - 'yes', 'no', 'maybe')
      - `guest_count` (integer, default 1)
      - `dietary_restrictions` (text, optional)
      - `message` (text, optional)
      - `created_at` (timestamp)

    - `guestbook_messages`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `message` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for public insert access (for guest submissions)
*/

-- RSVP Responses Table
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  attendance text NOT NULL CHECK (attendance IN ('yes', 'no', 'maybe')),
  guest_count integer DEFAULT 1 CHECK (guest_count > 0),
  dietary_restrictions text,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Allow public to read RSVP responses (for admin purposes)
CREATE POLICY "Allow public read access to RSVP responses"
  ON rsvp_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public to insert RSVP responses
CREATE POLICY "Allow public insert access to RSVP responses"
  ON rsvp_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Guestbook Messages Table
CREATE TABLE IF NOT EXISTS guestbook_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to read guestbook messages
CREATE POLICY "Allow public read access to guestbook messages"
  ON guestbook_messages
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public to insert guestbook messages
CREATE POLICY "Allow public insert access to guestbook messages"
  ON guestbook_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);