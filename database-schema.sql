-- Portfolio table schema for Supabase
-- This file contains the SQL commands to create the necessary tables

-- Create portfolio table
CREATE TABLE IF NOT EXISTS portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  location VARCHAR(100) NOT NULL,
  user_id UUID NOT NULL REFERENCES user(public_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own portfolio items
CREATE POLICY "Users can view own portfolio items" ON portfolio
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can only insert their own portfolio items
CREATE POLICY "Users can insert own portfolio items" ON portfolio
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Users can only update their own portfolio items
CREATE POLICY "Users can update own portfolio items" ON portfolio
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Users can only delete their own portfolio items
CREATE POLICY "Users can delete own portfolio items" ON portfolio
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for portfolio bucket
CREATE POLICY "Anyone can view portfolio images" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload portfolio images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own portfolio images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'portfolio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own portfolio images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to insert posts where their public_id matches
create policy "Users can insert their own posts"
on posts
for insert
to authenticated
with check (
  public_id = (select public_id from "user" where email = auth.email())
);

create policy "Allow logged in users to insert posts"
on posts
for insert
with check (auth.uid() = user_id);


-- Allow users to select only their own posts
create policy "Users can select their own posts"
on posts
for select
to authenticated
using (
  public_id = (select public_id from "user" where email = auth.email())
);

create policy "Allow anyone to insert posts"
on posts
for insert
with check (true);



-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_updated_at 
  BEFORE UPDATE ON portfolio 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
