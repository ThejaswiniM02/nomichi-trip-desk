-- TRIPS
create table trips (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  price_with_gst numeric(10,2) not null,
  total_seats int not null,
  status text not null default 'open' check (status in ('open','closed')),
  description text,
  created_at timestamptz default now()
);

-- LEADS
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  trip_id uuid references trips(id) on delete set null,
  group_type text check (group_type in ('solo','friends','couple','family')),
  preferred_month text,
  vibe text,
  status text not null default 'NEW' check (status in ('NEW','CONTACTED','QUALIFIED','VIBE_CHECK_SENT','CONFIRMED','NOT_A_FIT')),
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- CALL LOGS
create table call_logs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  note text not null,
  next_action text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- SEED TRIPS
insert into trips (name, destination, start_date, end_date, price_with_gst, total_seats, status, description) values
('Spiti Winter Escape', 'Spiti Valley, Himachal Pradesh', '2025-02-10', '2025-02-17', 24999, 8, 'open', 'Eight days in the cold desert. Frozen rivers, monastery mornings, and silence you can actually hear.'),
('Coorg Slow Weekend', 'Coorg, Karnataka', '2025-01-18', '2025-01-20', 8999, 10, 'open', 'Two nights in the coffee hills. Rain, mist, and a pace your weekday brain has forgotten.'),
('Dzukou Valley Trek', 'Nagaland', '2025-03-05', '2025-03-10', 18999, 6, 'open', 'Five days walking into one of the most untouched valleys in the northeast. Small group, no shortcuts.'),
('Rann of Kutch', 'Gujarat', '2025-01-25', '2025-01-28', 12999, 12, 'closed', 'The white salt desert under a full moon. This one is sold out.');

-- SEED LEADS
insert into leads (name, phone, email, trip_id, group_type, preferred_month, vibe, status) values
('Priya Sharma', '9876543210', 'priya@example.com', (select id from trips where name='Spiti Winter Escape'), 'friends', 'February', 'Want to disconnect and actually feel cold for once. No itinerary overload please.', 'CONTACTED'),
('Arjun Mehta', '9123456789', 'arjun@example.com', (select id from trips where name='Coorg Slow Weekend'), 'couple', 'January', 'Just want a quiet place to read and eat well.', 'NEW'),
('Sneha Rao', '9988776655', 'sneha@example.com', (select id from trips where name='Dzukou Valley Trek'), 'solo', 'March', 'First solo trip. A little nervous but very ready.', 'QUALIFIED');