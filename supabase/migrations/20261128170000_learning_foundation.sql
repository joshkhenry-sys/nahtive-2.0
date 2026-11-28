-- Nahtive 2.0 learning foundation: curriculum, learner progress, reviews, and points.
-- This migration is safe to apply to the existing Spanish-only V2 schema.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  language_id uuid not null references public.languages(id) on delete restrict,
  level text not null check (level in ('A1','A2','B1','B2','C1','C2')),
  title text not null,
  description text not null default '',
  sequence integer not null default 1,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(language_id, level),
  unique(language_id, sequence)
);

create table if not exists public.course_units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  learning_objectives jsonb not null default '[]'::jsonb,
  sequence integer not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique(course_id, sequence)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.course_units(id) on delete cascade,
  slug text not null,
  title text not null,
  description text not null default '',
  lesson_type text not null default 'core' check (lesson_type in ('core','review','assessment','speaking')),
  estimated_minutes integer not null default 25 check (estimated_minutes > 0),
  sequence integer not null,
  learning_objectives jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  points_reward integer not null default 20 check (points_reward >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(unit_id, slug),
  unique(unit_id, sequence)
);

create table if not exists public.learner_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  status text not null default 'active' check (status in ('active','completed','paused')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  attempts integer not null default 0 check (attempts >= 0),
  best_score numeric(5,2) check (best_score between 0 and 100),
  points_earned integer not null default 0 check (points_earned >= 0),
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  unique(user_id, lesson_id)
);

create table if not exists public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score numeric(5,2) check (score between 0 and 100),
  feedback jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.learner_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_points integer not null default 0 check (total_points >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('lesson_completion','review_completion','assessment_bonus')),
  source_id text not null,
  points integer not null check (points > 0),
  created_at timestamptz not null default now(),
  unique(user_id, source_type, source_id)
);

create table if not exists public.review_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  prompt text not null,
  expected_answer text not null,
  explanation text not null default '',
  due_at timestamptz not null default now(),
  interval_days integer not null default 1 check (interval_days > 0),
  ease_factor numeric(4,2) not null default 2.50 check (ease_factor >= 1.30),
  repetitions integer not null default 0 check (repetitions >= 0),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_url text;
alter table public.learner_languages
  add column if not exists starting_level text
  check (starting_level in ('A1','A2','B1','B2','C1','C2'));
alter table public.learner_languages alter column starting_level drop default;
alter table public.learner_languages alter column starting_level drop not null;

insert into public.courses (language_id, level, title, description, sequence, is_published)
select l.id, v.level, v.title, v.description, v.sequence, false
from public.languages l
cross join (values
  ('A1','Spanish Foundations','Build essential Spanish through sound, core sentence patterns, everyday language, and guided communication.',1),
  ('A2','Everyday Spanish','Expand practical communication, narration, descriptions, and connected sentences.',2),
  ('B1','Independent Spanish','Develop confident narration, explanations, opinions, and spontaneous conversation.',3),
  ('B2','Confident Spanish','Build flexible fluency, complex grammar, natural phrasing, and nuanced discussion.',4),
  ('C1','Advanced Spanish','Refine precision, register, idiomatic expression, and complex communication.',5),
  ('C2','Spanish Mastery','Develop exceptional control of nuance, style, inference, and expressive range.',6)
) as v(level,title,description,sequence)
where l.code = 'es'
on conflict (language_id, level) do nothing;

alter table public.courses enable row level security;
alter table public.course_units enable row level security;
alter table public.lessons enable row level security;
alter table public.learner_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.learner_stats enable row level security;
alter table public.point_transactions enable row level security;
alter table public.review_items enable row level security;

drop policy if exists "Published courses are viewable" on public.courses;
drop policy if exists "Course catalog is viewable" on public.courses;
create policy "Course catalog is viewable" on public.courses
  for select to authenticated using (true);

drop policy if exists "Published units are viewable" on public.course_units;
create policy "Published units are viewable" on public.course_units
  for select to authenticated using (
    is_published = true and exists (
      select 1 from public.courses c where c.id = course_id and c.is_published = true
    )
  );

drop policy if exists "Published lessons are viewable" on public.lessons;
create policy "Published lessons are viewable" on public.lessons
  for select to authenticated using (
    is_published = true and exists (
      select 1 from public.course_units u
      join public.courses c on c.id = u.course_id
      where u.id = unit_id and u.is_published = true and c.is_published = true
    )
  );

drop policy if exists "Users view own enrollments" on public.learner_enrollments;
create policy "Users view own enrollments" on public.learner_enrollments
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users create own enrollments" on public.learner_enrollments;
create policy "Users create own enrollments" on public.learner_enrollments
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users update own enrollments" on public.learner_enrollments;
create policy "Users update own enrollments" on public.learner_enrollments
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users manage own lesson progress" on public.lesson_progress;
create policy "Users manage own lesson progress" on public.lesson_progress
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users view own lesson attempts" on public.lesson_attempts;
create policy "Users view own lesson attempts" on public.lesson_attempts
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users create own lesson attempts" on public.lesson_attempts;
create policy "Users create own lesson attempts" on public.lesson_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "Users view own learner stats" on public.learner_stats;
create policy "Users view own learner stats" on public.learner_stats
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users view own point transactions" on public.point_transactions;
create policy "Users view own point transactions" on public.point_transactions
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "Users manage own review items" on public.review_items;
create policy "Users manage own review items" on public.review_items
  for all to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select on public.courses, public.course_units, public.lessons to authenticated;
grant select, insert, update on public.learner_enrollments to authenticated;
grant select, insert, update on public.lesson_progress to authenticated;
grant select, insert on public.lesson_attempts to authenticated;
grant select on public.learner_stats, public.point_transactions to authenticated;
grant select, insert, update on public.review_items to authenticated;

create or replace function public.award_lesson_points(p_lesson_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_points integer;
  v_inserted integer;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select l.points_reward into v_points
  from public.lessons l
  join public.lesson_progress lp on lp.lesson_id = l.id
  where l.id = p_lesson_id
    and lp.user_id = v_user_id
    and lp.status = 'completed'
    and l.is_published = true;

  if v_points is null or v_points <= 0 then
    return 0;
  end if;

  insert into public.point_transactions(user_id, source_type, source_id, points)
  values (v_user_id, 'lesson_completion', p_lesson_id::text, v_points)
  on conflict (user_id, source_type, source_id) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then return 0; end if;

  insert into public.learner_stats(user_id, total_points, current_streak, longest_streak, last_activity_date)
  values (v_user_id, v_points, 1, 1, current_date)
  on conflict (user_id) do update set
    total_points = public.learner_stats.total_points + excluded.total_points,
    current_streak = case
      when public.learner_stats.last_activity_date = current_date then public.learner_stats.current_streak
      when public.learner_stats.last_activity_date = current_date - 1 then public.learner_stats.current_streak + 1
      else 1
    end,
    longest_streak = greatest(
      public.learner_stats.longest_streak,
      case
        when public.learner_stats.last_activity_date = current_date then public.learner_stats.current_streak
        when public.learner_stats.last_activity_date = current_date - 1 then public.learner_stats.current_streak + 1
        else 1
      end
    ),
    last_activity_date = current_date,
    updated_at = now();

  return v_points;
end;
$$;

revoke all on function public.award_lesson_points(uuid) from public;
revoke all on function public.award_lesson_points(uuid) from anon;
grant execute on function public.award_lesson_points(uuid) to authenticated;
