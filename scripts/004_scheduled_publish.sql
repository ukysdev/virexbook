-- Scheduled chapter publish support
ALTER TABLE public.chapters
ADD COLUMN IF NOT EXISTS publish_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_chapters_publish_at
ON public.chapters (publish_at);

CREATE INDEX IF NOT EXISTS idx_chapters_status_publish_at
ON public.chapters (status, publish_at);
