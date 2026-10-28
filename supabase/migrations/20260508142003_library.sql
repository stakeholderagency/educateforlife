
-- Categories (top-level groupings, e.g., Mighty "collections" or "spaces")
CREATE TABLE public.library_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id TEXT UNIQUE,
  source_url TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  topic_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Topics (a thread within a category)
CREATE TABLE public.library_topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.library_categories(id) ON DELETE CASCADE,
  source_id TEXT UNIQUE,
  source_url TEXT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  author_display_name TEXT,
  author_avatar_url TEXT,
  post_count INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  source_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX library_topics_category_idx ON public.library_topics(category_id);
CREATE INDEX library_topics_last_activity_idx ON public.library_topics(last_activity_at DESC);

-- Posts and replies within a topic (parent_post_id NULL = root post)
CREATE TABLE public.library_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES public.library_topics(id) ON DELETE CASCADE,
  parent_post_id UUID REFERENCES public.library_posts(id) ON DELETE CASCADE,
  source_id TEXT UNIQUE,
  source_url TEXT,
  body_html TEXT,
  body_text TEXT,
  author_display_name TEXT,
  author_avatar_url TEXT,
  source_created_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX library_posts_topic_idx ON public.library_posts(topic_id);
CREATE INDEX library_posts_parent_idx ON public.library_posts(parent_post_id);

-- Attachments (rehosted in Storage)
CREATE TABLE public.library_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.library_posts(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_url TEXT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX library_attachments_post_idx ON public.library_attachments(post_id);

-- Enable RLS on all tables
ALTER TABLE public.library_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_attachments ENABLE ROW LEVEL SECURITY;

-- Read access: any authenticated user
CREATE POLICY "Authenticated can view categories"
  ON public.library_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view topics"
  ON public.library_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view posts"
  ON public.library_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view attachments"
  ON public.library_attachments FOR SELECT TO authenticated USING (true);

-- Write access: admins only
CREATE POLICY "Admins manage categories"
  ON public.library_categories FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage topics"
  ON public.library_topics FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage posts"
  ON public.library_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage attachments"
  ON public.library_attachments FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- updated_at triggers
CREATE TRIGGER set_library_categories_updated_at
  BEFORE UPDATE ON public.library_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_library_topics_updated_at
  BEFORE UPDATE ON public.library_topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER set_library_posts_updated_at
  BEFORE UPDATE ON public.library_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public storage bucket for rehosted attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('library-attachments', 'library-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read library attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'library-attachments');

CREATE POLICY "Admins write library attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'library-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update library attachments"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'library-attachments' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete library attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'library-attachments' AND has_role(auth.uid(), 'admin'::app_role));
