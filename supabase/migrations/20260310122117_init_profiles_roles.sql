
-- Create enum for member types
CREATE TYPE public.member_type AS ENUM ('entrepreneur', 'academic', 'learner', 'professional');

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'member');

-- Create enum for work type
CREATE TYPE public.work_type AS ENUM ('startup', 'academic_institution', 'organization', 'independent', 'other');

-- Create enum for interest category
CREATE TYPE public.interest_category AS ENUM ('passion', 'learning', 'expertise', 'seeking');

-- Create enum for activity type
CREATE TYPE public.activity_type AS ENUM ('event', 'course', 'project', 'contribution', 'mentoring', 'workshop');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  headline TEXT,
  member_type member_type,
  location_city TEXT,
  location_country TEXT,
  timezone TEXT,
  languages TEXT[],
  skills TEXT[],
  mission_statement TEXT,
  looking_for TEXT,
  offering TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  phone TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_work table
CREATE TABLE public.member_work (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_type work_type NOT NULL,
  organization_name TEXT NOT NULL,
  organization_domain TEXT,
  role_title TEXT,
  description TEXT,
  is_current BOOLEAN NOT NULL DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_interests table
CREATE TABLE public.member_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  category interest_category NOT NULL DEFAULT 'passion',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_activities table
CREATE TABLE public.member_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles: viewable by all authenticated, editable by owner
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Member work: viewable by all authenticated, editable by owner
CREATE POLICY "Work entries are viewable by authenticated users" ON public.member_work FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own work" ON public.member_work FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own work" ON public.member_work FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own work" ON public.member_work FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Member interests: viewable by all authenticated, editable by owner
CREATE POLICY "Interests are viewable by authenticated users" ON public.member_interests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own interests" ON public.member_interests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own interests" ON public.member_interests FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Member activities: viewable by all authenticated, editable by owner
CREATE POLICY "Activities are viewable by authenticated users" ON public.member_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own activities" ON public.member_activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles: security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_member_work_updated_at BEFORE UPDATE ON public.member_work FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Avatar storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
