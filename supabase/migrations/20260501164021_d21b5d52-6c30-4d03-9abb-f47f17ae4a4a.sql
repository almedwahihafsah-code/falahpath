CREATE TABLE public.verse_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  verse_id UUID NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, verse_id)
);

ALTER TABLE public.verse_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_select_own" ON public.verse_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert_own" ON public.verse_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete_own" ON public.verse_bookmarks FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_update_own" ON public.verse_bookmarks FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_verse_bookmarks_user ON public.verse_bookmarks(user_id);
CREATE INDEX idx_verse_bookmarks_verse ON public.verse_bookmarks(verse_id);