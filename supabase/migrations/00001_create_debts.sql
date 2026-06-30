-- Kasbon: Create debts table with RLS policies
-- Migration: 00001_create_debts

-- 1. Create debt_type enum
CREATE TYPE debt_type AS ENUM ('owed_to_me', 'i_owe');

-- 2. Create debts table
CREATE TABLE debts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type debt_type NOT NULL,
  counterpart_name text NOT NULL,
  amount bigint NOT NULL CHECK (amount > 0),
  note text,
  due_date date,
  settled_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Enable Row Level Security
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- 4. Grant API access to authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON debts TO authenticated;

-- 5. RLS Policies
-- Using TO authenticated pattern (NOT deprecated auth.role())

-- SELECT: Users can only see their own debts
CREATE POLICY "Users can view own debts" ON debts
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- INSERT: Users can only create their own debts
CREATE POLICY "Users can insert own debts" ON debts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can only update their own debts
-- MUST have both USING and WITH CHECK to prevent user_id reassignment
CREATE POLICY "Users can update own debts" ON debts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can only delete their own debts
CREATE POLICY "Users can delete own debts" ON debts
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
