-- GYMBROS Database Schema
-- Created: October 21, 2025
-- Database: PostgreSQL (Supabase)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE weight_unit AS ENUM ('kg', 'lbs');
CREATE TYPE exercise_type AS ENUM ('machine', 'free');
CREATE TYPE group_role AS ENUM ('admin', 'member');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'rejected');

-- ============================================
-- USERS TABLE
-- ============================================
-- Note: Supabase Auth handles user authentication
-- This table extends the auth.users table with additional profile info
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    profile_picture_url TEXT,
    weight_unit_preference weight_unit DEFAULT 'kg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile"
    ON public.users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- EXERCISES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    exercise_name TEXT NOT NULL,
    type exercise_type NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    weight_unit weight_unit NOT NULL,
    sets INTEGER NOT NULL CHECK (sets > 0),
    reps JSONB NOT NULL, -- Array of rep counts, e.g., [10, 8, 8]
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON public.exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_date ON public.exercises(date);
CREATE INDEX IF NOT EXISTS idx_exercises_exercise_name ON public.exercises(exercise_name);

-- Add RLS policies
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Users can view their own exercises
DROP POLICY IF EXISTS "Users can view own exercises" ON public.exercises;
CREATE POLICY "Users can view own exercises"
    ON public.exercises
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own exercises
DROP POLICY IF EXISTS "Users can insert own exercises" ON public.exercises;
CREATE POLICY "Users can insert own exercises"
    ON public.exercises
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own exercises
DROP POLICY IF EXISTS "Users can update own exercises" ON public.exercises;
CREATE POLICY "Users can update own exercises"
    ON public.exercises
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own exercises
DROP POLICY IF EXISTS "Users can delete own exercises" ON public.exercises;
CREATE POLICY "Users can delete own exercises"
    ON public.exercises
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- GROUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    goal TEXT,
    cover_image_url TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);

-- ============================================
-- GROUP_MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role group_role NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id) -- Prevent duplicate memberships
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);

-- ============================================
-- RLS POLICIES FOR GROUPS TABLE
-- ============================================
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Users can view groups they are members of
DROP POLICY IF EXISTS "Users can view groups they belong to" ON public.groups;
CREATE POLICY "Users can view groups they belong to"
    ON public.groups
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
        )
    );

-- Users can insert groups (they will become admin automatically via trigger)
DROP POLICY IF EXISTS "Users can create groups" ON public.groups;
CREATE POLICY "Users can create groups"
    ON public.groups
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Group admins can update groups
DROP POLICY IF EXISTS "Group admins can update groups" ON public.groups;
CREATE POLICY "Group admins can update groups"
    ON public.groups
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- Group admins can delete groups
DROP POLICY IF EXISTS "Group admins can delete groups" ON public.groups;
CREATE POLICY "Group admins can delete groups"
    ON public.groups
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = groups.id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- ============================================
-- RLS POLICIES FOR GROUP_MEMBERS TABLE
-- ============================================
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of groups they belong to
DROP POLICY IF EXISTS "Users can view group members" ON public.group_members;
CREATE POLICY "Users can view group members"
    ON public.group_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members AS gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
        )
    );

-- Users can join groups (via invitation acceptance)
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can join groups"
    ON public.group_members
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Group admins can remove members
DROP POLICY IF EXISTS "Group admins can remove members" ON public.group_members;
CREATE POLICY "Group admins can remove members"
    ON public.group_members
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members AS gm
            WHERE gm.group_id = group_members.group_id
            AND gm.user_id = auth.uid()
            AND gm.role = 'admin'
        )
    );

-- Users can leave groups (delete their own membership)
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;
CREATE POLICY "Users can leave groups"
    ON public.group_members
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- GROUP_INVITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    status invitation_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, email) -- Prevent duplicate invitations
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_group_invitations_group_id ON public.group_invitations(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invitations_email ON public.group_invitations(email);
CREATE INDEX IF NOT EXISTS idx_group_invitations_status ON public.group_invitations(status);

-- Add RLS policies
ALTER TABLE public.group_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations sent to their email
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.group_invitations;
CREATE POLICY "Users can view their own invitations"
    ON public.group_invitations
    FOR SELECT
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Group admins can create invitations
DROP POLICY IF EXISTS "Group admins can create invitations" ON public.group_invitations;
CREATE POLICY "Group admins can create invitations"
    ON public.group_invitations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = group_invitations.group_id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- Users can update invitations sent to them (accept/reject)
DROP POLICY IF EXISTS "Users can respond to their invitations" ON public.group_invitations;
CREATE POLICY "Users can respond to their invitations"
    ON public.group_invitations
    FOR UPDATE
    USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- Group admins can view all invitations for their groups
DROP POLICY IF EXISTS "Group admins can view group invitations" ON public.group_invitations;
CREATE POLICY "Group admins can view group invitations"
    ON public.group_invitations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members
            WHERE group_members.group_id = group_invitations.group_id
            AND group_members.user_id = auth.uid()
            AND group_members.role = 'admin'
        )
    );

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to automatically add group creator as admin
CREATE OR REPLACE FUNCTION add_group_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.group_members (group_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function after group creation
CREATE TRIGGER on_group_created
    AFTER INSERT ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION add_group_creator_as_admin();

-- Function to create user profile after sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function after user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================
-- VIEWS (Optional - for easier querying)
-- ============================================

-- View for group exercise logs (shows all exercises from group members)
CREATE OR REPLACE VIEW group_exercises AS
SELECT
    e.*,
    u.name as user_name,
    u.profile_picture_url,
    gm.group_id
FROM public.exercises e
JOIN public.users u ON e.user_id = u.id
JOIN public.group_members gm ON u.id = gm.user_id;

-- Grant access to the view
GRANT SELECT ON group_exercises TO authenticated;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment the following to add sample data

-- INSERT INTO public.users (id, email, name, weight_unit_preference) VALUES
-- (uuid_generate_v4(), 'john@example.com', 'John Doe', 'kg'),
-- (uuid_generate_v4(), 'jane@example.com', 'Jane Smith', 'lbs');

COMMENT ON TABLE public.users IS 'User profiles extending Supabase Auth';
COMMENT ON TABLE public.exercises IS 'Exercise logs tracked by users';
COMMENT ON TABLE public.groups IS 'Workout groups for competition';
COMMENT ON TABLE public.group_members IS 'Group membership and roles';
COMMENT ON TABLE public.group_invitations IS 'Pending and processed group invitations';
