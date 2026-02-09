-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  is_verified boolean default false,
  is_staff boolean default false,
  is_admin boolean default false,
  follower_count int default 0,
  following_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  cover_url text,
  genre text not null default 'Other',
  tags text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_original boolean default false,
  is_staff_pick boolean default false,
  is_featured boolean default false,
  view_count int default 0,
  like_count int default 0,
  chapter_count int default 0,
  language text default 'de',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.books enable row level security;

create policy "books_select_published" on public.books for select using (
  status = 'published' or auth.uid() = user_id
);
create policy "books_insert_own" on public.books for insert with check (auth.uid() = user_id);
create policy "books_update_own" on public.books for update using (auth.uid() = user_id);
create policy "books_delete_own" on public.books for delete using (auth.uid() = user_id);

-- Chapters table
create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text default '',
  order_index int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published')),
  word_count int default 0,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.chapters enable row level security;

create policy "chapters_select_published" on public.chapters for select using (
  status = 'published' or auth.uid() = user_id
);
create policy "chapters_insert_own" on public.chapters for insert with check (auth.uid() = user_id);
create policy "chapters_update_own" on public.chapters for update using (auth.uid() = user_id);
create policy "chapters_delete_own" on public.chapters for delete using (auth.uid() = user_id);

-- Likes table
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, book_id)
);

alter table public.likes enable row level security;

create policy "likes_select_all" on public.likes for select using (true);
create policy "likes_insert_own" on public.likes for insert with check (auth.uid() = user_id);
create policy "likes_delete_own" on public.likes for delete using (auth.uid() = user_id);

-- Comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- Follows table
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(follower_id, following_id)
);

alter table public.follows enable row level security;

create policy "follows_select_all" on public.follows for select using (true);
create policy "follows_insert_own" on public.follows for insert with check (auth.uid() = follower_id);
create policy "follows_delete_own" on public.follows for delete using (auth.uid() = follower_id);

-- Reading progress table
create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  scroll_position float default 0,
  updated_at timestamptz default now(),
  unique(user_id, book_id)
);

alter table public.reading_progress enable row level security;

create policy "progress_select_own" on public.reading_progress for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.reading_progress for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.reading_progress for update using (auth.uid() = user_id);

-- Reading lists (bookmarks)
create table if not exists public.reading_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, book_id)
);

alter table public.reading_lists enable row level security;

create policy "reading_lists_select_own" on public.reading_lists for select using (auth.uid() = user_id);
create policy "reading_lists_insert_own" on public.reading_lists for insert with check (auth.uid() = user_id);
create policy "reading_lists_delete_own" on public.reading_lists for delete using (auth.uid() = user_id);
