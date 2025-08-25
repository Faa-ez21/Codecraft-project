-- SQL script to create message_replies table for storing admin replies to contact messages

-- Create message_replies table
CREATE TABLE IF NOT EXISTS message_replies (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES contact(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_to TEXT NOT NULL,
  sent_by TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_message_replies_message_id ON message_replies(message_id);
CREATE INDEX IF NOT EXISTS idx_message_replies_sent_at ON message_replies(sent_at);

-- Add RLS policies
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage replies
CREATE POLICY "Admins can manage message replies" ON message_replies
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role IN ('admin', 'super_admin')
  )
);

-- Add status column to contact table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contact' AND column_name = 'status') THEN
        ALTER TABLE contact ADD COLUMN status TEXT DEFAULT 'unread';
    END IF;
END $$;

-- Add updated_at column to contact table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contact' AND column_name = 'updated_at') THEN
        ALTER TABLE contact ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to contact table
DROP TRIGGER IF EXISTS update_contact_updated_at ON contact;
CREATE TRIGGER update_contact_updated_at
    BEFORE UPDATE ON contact
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
