ALTER TABLE public.chapters
ADD COLUMN IF NOT EXISTS audio_url text;
