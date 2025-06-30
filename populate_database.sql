-- =====================================================
-- Populate Database with Mocked Data
-- Copy and paste this entire script into Supabase SQL Editor
-- =====================================================

-- Insert placeholder user
INSERT INTO users (
  id, 
  supabase_id, 
  email, 
  name, 
  email_verified, 
  created_at
) VALUES (
  'SUPAAAA', 
  'SUPAAAA'::uuid, 
  'emils@plavenieks.lv', 
  'Emīls Pļavenieks', 
  true, 
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  email_verified = EXCLUDED.email_verified;

-- Insert profiles from mocked data
INSERT INTO profiles (
  id,
  user_id,
  name,
  email,
  image,
  description,
  target_mrr,
  current_mrr,
  type,
  company_type,
  is_public,
  is_featured,
  view_count,
  created_at
) VALUES
  -- Emīls Pļavenieks (person, sponsored)
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'SUPAAAA',
    'Emīls Pļavenieks',
    'emils@plavenieks.lv',
    'https://avatars.githubusercontent.com/u/16500803?v=4',
    'Full-stack developer building innovative web applications',
    44000,
    15000,
    'person',
    null,
    true,
    true,
    0,
    now() - interval '15 days'
  ),
  -- Vidyly (SaaS company, sponsored)
  (
    '550e8400-e29b-41d4-a716-446655440002',
    null,
    'Vidyly',
    null,
    'https://avatars.githubusercontent.com/u/150893289?s=400&u=aaa0e43c059339a3dfa1fa303de6f8d4f86089fb&v=4',
    'SaaS platform for digitalization of business processes',
    30000,
    1600,
    'company',
    'SaaS',
    true,
    true,
    0,
    now() - interval '15 days'
  ),
  -- ProductionLine.io (SaaS company)
  (
    '550e8400-e29b-41d4-a716-446655440004',
    null,
    'ProductionLine.io',
    null,
    'https://demo.productionline.io/assets/logo.png',
    'Digitalize factory processes with trackable tasks',
    10000,
    1000,
    'company',
    'SaaS',
    true,
    false,
    0,
    now() - interval '15 days'
  ),
  -- Stripe (Other company)
  (
    '550e8400-e29b-41d4-a716-446655440005',
    null,
    'Stripe',
    null,
    'https://thetribe.io/wp-content/uploads/Logo-Stripe-1080x675-1.jpg',
    'Payment processing for online businesses',
    null,
    null,
    'company',
    'Other',
    true,
    false,
    0,
    now() - interval '15 days'
  ),
  -- Hetzner (Other company)
  (
    '550e8400-e29b-41d4-a716-446655440006',
    null,
    'Hetzner',
    null,
    'https://www.svgrepo.com/show/331425/hetzner.svg',
    'Cloud hosting provider',
    null,
    null,
    'company',
    'Other',
    true,
    false,
    0,
    now() - interval '15 days'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  description = EXCLUDED.description,
  target_mrr = EXCLUDED.target_mrr,
  current_mrr = EXCLUDED.current_mrr,
  type = EXCLUDED.type,
  company_type = EXCLUDED.company_type;

-- Insert connections from mocked data
INSERT INTO connections (
  id,
  initiated_by,
  source_profile_id,
  destination_profile_id,
  type,
  status,
  net,
  is_public,
  show_net,
  created_at,
  approved_at,
  approved_by
) VALUES
  -- Vidyly → Emīls (source connection)
  (
    '550e8400-e29b-41d4-a712-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'partner',
    'approved',
    533, -- 1600 / 3 rounded
    true,
    true,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  -- ProductionLine.io → Emīls (source connection)
  (
    '550e8400-e29b-41d4-a712-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    'partner',
    'approved',
    333, -- 1000 / 3 rounded
    true,
    true,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  -- Emīls → Stripe (destination connection)
  (
    '550e8400-e29b-41d4-a712-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440005',
    'other',
    'approved',
    200,
    true,
    false,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440005'
  ),
  -- Emīls → Hetzner (destination connection)
  (
    '550e8400-e29b-41d4-a712-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440006',
    'other',
    'approved',
    60,
    true,
    true,
    now() - interval '10 days',
    now() - interval '9 days',
    '550e8400-e29b-41d4-a716-446655440006'
  )
ON CONFLICT (id) DO UPDATE SET
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  net = EXCLUDED.net,
  is_public = EXCLUDED.is_public,
  show_net = EXCLUDED.show_net;

-- Insert sample profile views for analytics testing
INSERT INTO profile_views (profile_id, viewer_ip, viewed_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '192.168.1.1', now() - interval '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440001', '192.168.1.2', now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440001', '192.168.1.3', now() - interval '1 day'),
  ('550e8400-e29b-41d4-a716-446655440002', '192.168.1.4', now() - interval '3 hours'),
  ('550e8400-e29b-41d4-a716-446655440002', '192.168.1.5', now() - interval '1 day'),
  ('550e8400-e29b-41d4-a716-446655440004', '192.168.1.6', now() - interval '30 minutes'),
  ('550e8400-e29b-41d4-a716-446655440005', '192.168.1.7', now() - interval '4 hours'),
  ('550e8400-e29b-41d4-a716-446655440006', '192.168.1.8', now() - interval '6 hours');

-- Update profile view counts based on sample data
UPDATE profiles SET view_count = (
  SELECT COUNT(*) FROM profile_views WHERE profile_views.profile_id = profiles.id
);

-- Insert sample notifications for testing
INSERT INTO notifications (user_id, type, title, message, data, created_at) VALUES
  ('SUPAAAA', 'connection_request', 'New Connection Request', 'Vidyly wants to connect with you', '{"connection_id": "550e8400-e29b-41d4-a712-446655440001", "profile_name": "Vidyly"}', now() - interval '10 days'),
  ('SUPAAAA', 'connection_approved', 'Connection Approved', 'Your connection with ProductionLine.io has been approved', '{"connection_id": "550e8400-e29b-41d4-a712-446655440002", "profile_name": "ProductionLine.io"}', now() - interval '9 days');

-- Verify the data was inserted correctly
SELECT 'Data population completed!' as status;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as connection_count FROM connections;
SELECT COUNT(*) as profile_view_count FROM profile_views;
SELECT COUNT(*) as notification_count FROM notifications; 