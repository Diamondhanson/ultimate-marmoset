-- ============================================================================
-- ONE-TIME SETUP (already run on the live project)
--
-- The Supabase project had a different site's schema in it by mistake. This
-- script removes those tables (only when they hold no data) and then runs the
-- full Ultimate Marmoset schema. Everything happens in one transaction, so a
-- failure at any step leaves the database untouched.
--
-- For a brand new Supabase project, use supabase/schema.sql instead.
-- ============================================================================

begin;

-- Safety check: stop if Bargain Outlet has any orders, pallets or messages.
do $$
declare n bigint := 0;
begin
  if to_regclass('public.pallets') is not null then
    execute 'select count(*) from public.pallets' into n;
    if n > 0 then raise exception 'Stopped: public.pallets has % rows', n; end if;
  end if;
  if to_regclass('public.order_lines') is not null then
    execute 'select count(*) from public.order_lines' into n;
    if n > 0 then raise exception 'Stopped: public.order_lines has % rows', n; end if;
  end if;
  if to_regclass('public.contact_messages') is not null then
    execute 'select count(*) from public.contact_messages' into n;
    if n > 0 then raise exception 'Stopped: public.contact_messages has % rows', n; end if;
  end if;
  -- Bargain Outlet's orders table has a `reference` column; ours does not.
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'orders'
               and column_name = 'reference') then
    execute 'select count(*) from public.orders' into n;
    if n > 0 then raise exception 'Stopped: Bargain Outlet public.orders has % rows', n; end if;
    execute 'drop table public.orders cascade';
  end if;
end $$;

drop table if exists public.order_lines      cascade;
drop table if exists public.pallets          cascade;
drop table if exists public.categories       cascade;
drop table if exists public.contact_messages cascade;
drop table if exists public.admins           cascade;
drop function if exists public.is_admin();

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.monkeys (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  species        text not null,
  gender         text not null default 'male' check (gender in ('male', 'female')),
  markings       text not null default '',
  date_of_birth  date not null,
  price          numeric not null check (price > 0),
  description    text not null default '',
  temperament    text not null default '',
  vaccinated     boolean not null default true,
  diaper_trained boolean not null default true,
  hand_raised    boolean not null default true,
  health_notes   text not null default '',
  status         text not null default 'available' check (status in ('available', 'reserved', 'rehomed')),
  featured       boolean not null default false,
  images         text[] not null default '{}',
  created_at     timestamptz not null default now()
);

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email         text not null,
  phone         text not null default '',
  city          text not null default '',
  state         text not null default '',
  fulfilment    text not null default 'pickup' check (fulfilment in ('pickup', 'delivery')),
  message       text not null default '',
  status        text not null default 'new' check (status in ('new', 'contacted', 'completed', 'cancelled')),
  total         numeric not null default 0,
  created_at    timestamptz not null default now()
);

create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders (id) on delete cascade,
  monkey_id      uuid references public.monkeys (id) on delete set null,
  monkey_name    text not null,
  monkey_species text not null default '',
  price          numeric not null default 0
);

create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null default '',
  subject    text not null default '',
  message    text not null,
  status     text not null default 'new' check (status in ('new', 'replied')),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  location   text not null default '',
  rating     int not null check (rating between 1 and 5),
  message    text not null,
  approved   boolean not null default false,
  featured   boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- The website reads listings and approved reviews with the public (anon) key.
-- Reservations, reservation items and contact messages are written and read
-- only by the server using the service-role key (which bypasses RLS), so no
-- public policies are added for them.
-- ---------------------------------------------------------------------------

alter table public.monkeys     enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.contacts    enable row level security;
alter table public.reviews     enable row level security;

-- Base privileges (needed when this file is run through psql rather than the
-- dashboard SQL editor, where Supabase's default grants may not apply).
grant usage on schema public to anon, authenticated, service_role;
grant select on public.monkeys, public.reviews to anon, authenticated;
grant all on public.monkeys, public.orders, public.order_items,
             public.contacts, public.reviews
  to service_role;

drop policy if exists "Public can view monkeys" on public.monkeys;
create policy "Public can view monkeys"
  on public.monkeys for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can view approved reviews" on public.reviews;
create policy "Public can view approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (approved = true);

-- ---------------------------------------------------------------------------
-- Storage bucket for photos uploaded from the dashboard
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('monkey-images', 'monkey-images', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Sample listings (the same ones shown in preview mode). Their photos are the
-- files in /public/monkeys, so they keep working after you connect Supabase.
-- Delete them from the dashboard once you list real monkeys.
-- ---------------------------------------------------------------------------

insert into public.monkeys
  (id, slug, name, species, gender, markings, date_of_birth, price, description,
   temperament, vaccinated, diaper_trained, hand_raised, health_notes, status,
   featured, images, created_at)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'pip-common-marmoset',
    'Pip',
    'Common Marmoset',
    'male',
    'Silver-agouti with white ear tufts',
    '2026-06-02',
    3800,
    'Pip follows us from room to room. He is the first to climb onto a shoulder and the last to let go. We have raised him in our living room since he was three weeks old. He takes his formula without a fuss and chirps a greeting when he hears the kitchen door. He shares a hammock with his sister and would settle well into a calm home where someone is around.',
    'Curious, chatty, very attached to his people',
    true,
    true,
    true,
    'Two exotic-vet wellness exams complete, fecal screen clear, weight gain on target. Comes with full vet records, a feeding schedule, and two weeks of his current formula.',
    'available',
    true,
    array['/monkeys/marmoset-twins.jpg', '/monkeys/marmoset-trio.jpg'],
    '2026-08-20T10:00:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'willow-common-marmoset',
    'Willow',
    'Common Marmoset',
    'female',
    'Warm brindle with a banded tail',
    '2026-06-02',
    4100,
    'Willow is Pip''s sister and the gentler of the pair. She watches a new room carefully before she commits to it, then explores every inch of it. She loves mealworm treats, warm blankets, and being carried in a chest pouch while the household goes about its day. Marmosets thrive in company, so we would happily discuss a discount if she goes home with her brother.',
    'Gentle, watchful, affectionate once she settles',
    true,
    true,
    true,
    'Exotic-vet checked twice, fecal screen clear, supplemented with D3 and calcium since weaning. Full records travel with her.',
    'available',
    true,
    array['/monkeys/marmoset-duo.jpg', '/monkeys/marmoset-portrait.jpg'],
    '2026-08-20T10:05:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'twiggy-pygmy-marmoset',
    'Twiggy',
    'Pygmy Marmoset',
    'female',
    'Tawny-olive, ringed tail',
    '2026-06-24',
    4600,
    'Twiggy is the smallest monkey we have. She fits in the palm of a hand and weighs less than a bar of soap. Pygmy marmosets are what people mean by finger monkeys: tiny, quick, and busy all day. She is fully weaned onto gum, fruit and insects, and she has the boldest character here in the smallest body.',
    'Bold, quick, afraid of nothing',
    true,
    false,
    true,
    'Wellness exam at ten weeks, dewormed, doing well on a gum and insect diet. She comes with detailed care notes. Pygmy marmosets need specialist care and we talk every family through it.',
    'available',
    false,
    array['/monkeys/marmoset-palm.jpg', '/monkeys/marmoset-hand.jpg'],
    '2026-08-21T09:00:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000004',
    'mango-brown-capuchin',
    'Mango',
    'Brown Capuchin',
    'male',
    'Cinnamon coat, cream face',
    '2026-05-11',
    8200,
    'Mango is the joker here. He has worked out how to open the treat tin, undo a zipper, and convince every visitor that nobody has fed him. He is bottle-raised, wears a diaper without complaint, and falls asleep on someone''s chest most afternoons. A capuchin is a twenty to forty year commitment, so Mango needs a family who has thought that far ahead.',
    'Clever, mischievous, very affectionate',
    true,
    true,
    true,
    'Full exotic-vet workup, age-appropriate vaccinations, negative TB test, dewormed. Microchipped before he goes home, with a copy of his health certificate for interstate transport.',
    'available',
    true,
    array['/monkeys/capuchin-pink-teddy.jpg', '/monkeys/capuchin-baby.jpg'],
    '2026-08-22T11:00:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000005',
    'biscuit-brown-capuchin',
    'Biscuit',
    'Brown Capuchin',
    'female',
    'Golden-brown with a dark cap',
    '2026-05-11',
    8600,
    'Biscuit is Mango''s littermate and the steadier of the two. She is the one who sits quietly with a soft toy while the others tear around, and she has the sweetest habit of holding a finger while she drinks her bottle. She is excellent with calm dogs and has never once nipped a handler.',
    'Calm, patient, loves being held',
    true,
    true,
    true,
    'Exotic-vet checked, vaccinations current, negative TB test, dewormed. Health certificate issued within 10 days of travel.',
    'reserved',
    false,
    array['/monkeys/capuchin-blue-teddy.jpg', '/monkeys/capuchin-trio.jpg'],
    '2026-08-22T11:10:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000006',
    'pearl-white-faced-capuchin',
    'Pearl',
    'White-faced Capuchin',
    'female',
    'Cream mantle, black body',
    '2026-04-28',
    9400,
    'Pearl has the cream shoulders and pale face of a white-faced capuchin, and she carries herself like she knows it. She is confident with new people, travels well, and already answers to her name and to a hand signal for come. She is rewarding company and hard work in equal measure.',
    'Confident, expressive, easy to train',
    true,
    true,
    true,
    'Two wellness exams, vaccinations current, negative TB test, dewormed, microchipped. Parents both nursery-raised and health-screened.',
    'available',
    true,
    array['/monkeys/white-faced-capuchins.jpg', '/monkeys/capuchin-plush.jpg'],
    '2026-08-23T14:00:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000007',
    'nova-spider-monkey',
    'Nova',
    'Spider Monkey',
    'female',
    'Black with a pale mask and chest',
    '2026-04-05',
    11500,
    'Nova is all arms, legs and tail. She can hang from a curtain rail by her tail alone while eating a grape with both hands. She is the most affectionate monkey we have raised and will wrap all four limbs and her tail around whoever is closest. She needs real height to climb in and a family that is home most of the day.',
    'Athletic, affectionate, into everything',
    true,
    true,
    true,
    'Full exotic-vet workup, vaccinations current, negative TB test, dewormed, microchipped. Written health guarantee and transport health certificate included.',
    'available',
    false,
    array['/monkeys/spider-monkey-portrait.jpg', '/monkeys/spider-monkey-bag.jpg'],
    '2026-08-24T08:30:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000008',
    'rio-spider-monkey',
    'Rio',
    'Spider Monkey',
    'male',
    'Jet black with a tan saddle',
    '2026-03-19',
    12200,
    'Rio is the oldest baby here and the most settled. He is used to car rides and vet visits. He rides in a harness, naps in a sling, and always seems to notice when someone is upset. He walks on a lead and has met dogs, children and a very patient parrot without any trouble.',
    'Easy-going, used to travel, reads people well',
    true,
    true,
    true,
    'Vaccinations current, negative TB test, dewormed, microchipped, two clean wellness exams. Harness-trained and crate-conditioned for travel.',
    'available',
    false,
    array['/monkeys/spider-monkey-pair.jpg', '/monkeys/spider-monkey-carseat.jpg'],
    '2026-08-25T16:45:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000009',
    'sunny-squirrel-monkey',
    'Sunny',
    'Squirrel Monkey',
    'male',
    'Olive body, gold limbs, white mask',
    '2026-06-14',
    5900,
    'Sunny has a gold and olive coat and never stops. Squirrel monkeys are the busiest monkeys we raise. He is awake, moving and getting into things from sunrise, then sleeps hard in a fleece pouch by early evening. He gets on well with our house dog and would suit a lively, patient household.',
    'Busy, bright, friendly with everyone',
    true,
    false,
    true,
    'Wellness exam at eight weeks, dewormed, fecal screen clear, on a vitamin-D-supplemented diet. Full records and a detailed feeding plan travel with him.',
    'available',
    false,
    array['/monkeys/squirrel-monkey-cuddle.jpg', '/monkeys/monkeys-and-dog.jpg'],
    '2026-08-26T10:15:00Z'
  ),
  (
    '00000000-0000-4000-8000-000000000010',
    'ollie-macaque',
    'Ollie',
    'Macaque',
    'male',
    'Chestnut coat, pale muzzle',
    '2026-06-30',
    6800,
    'Ollie came to us at two weeks old and has been bottle-raised alongside his brother ever since. He will do anything for food, which makes him easy to train, and he sleeps through the night in a warmed pouch. Macaques are restricted in many states. We check the rules where you live before accepting any reservation.',
    'Motivated by food, easy to train, close to his brother',
    true,
    true,
    true,
    'Exotic-vet checked, vaccinations age-appropriate, negative TB test, dewormed. Legal eligibility confirmed with each buyer before a reservation is accepted.',
    'rehomed',
    false,
    array['/monkeys/macaque-babies.jpg', '/monkeys/howler-hug.jpg'],
    '2026-08-27T09:20:00Z'
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Sample reviews (shown on the home page once approved in the dashboard)
-- ---------------------------------------------------------------------------

insert into public.reviews
  (id, name, location, rating, message, approved, featured, created_at)
values
  (
    '30000000-0000-4000-8000-000000000001',
    'Danielle & Marco R.',
    'Austin, TX',
    5,
    'The deposit for the visit felt odd at first, and now I understand why they ask. We got two full hours, every question answered, and nobody rushing us. Pip has been home six weeks and he is exactly the monkey they described.',
    true,
    true,
    '2026-08-30T14:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'Kenneth B.',
    'Charlotte, NC',
    5,
    'They talked me out of a spider monkey and into a marmoset, which cost them money and won my trust. That conversation told me everything I needed to know about them.',
    true,
    true,
    '2026-08-18T09:30:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    'The Anand family',
    'Naperville, IL',
    5,
    'Delivery was handled start to finish: health certificate, travel crate, a call when they set off and another when they were twenty minutes away. Both girls arrived calm and were eating within the hour.',
    true,
    false,
    '2026-08-04T11:45:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    'Sofia L.',
    'Miami, FL',
    4,
    'Wonderful nursery and a healthy, beautiful capuchin. My only note is that they are busy, so give them a day to reply. Once they do, they are thorough.',
    true,
    false,
    '2026-07-22T16:20:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000005',
    'Hannah T.',
    'Portland, OR',
    5,
    'Six months of emails before we committed, and they never once pushed us. The care guide they sent home is better than anything I found online.',
    false,
    false,
    '2026-09-13T19:05:00Z'
  )
on conflict (id) do nothing;

commit;
