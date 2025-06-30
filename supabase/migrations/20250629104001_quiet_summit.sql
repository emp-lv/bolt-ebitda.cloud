/*
  # Sample Data for Development and Testing

  1. Sample Users
    - Demo users with different sponsor statuses
    
  2. Sample Profiles
    - Mix of personal and company profiles
    - Different company types and revenue levels
    
  3. Sample Connections
    - Various connection types and statuses
    - Realistic revenue amounts
    
  4. Sample Analytics Data
    - Profile views for testing analytics
*/

-- Insert sample users
INSERT INTO users (id, email, name, supabase_id, is_sponsor, email_verified, created_at) VALUES
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', 'emils@plavenieks.lv', 'Emīls Pļavenieks', '6c3ccd93-7f8b-4093-a119-12a054e771bc', false, true, now() - interval '18 days'),
  ('0fa1b51e-6578-49b1-acfa-551a1cbc9f97', 'sponsor@myearnings.online', 'Sponsored Stream', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97', true, true, now() - interval '11 days'),
  ('a4755b35-1d89-4bd0-836f-2365ec4a9a21', 'demo@myearnings.online', 'Demo User', 'a4755b35-1d89-4bd0-836f-2365ec4a9a21', false, true, now() - interval '7 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample profiles
INSERT INTO profiles (id, user_id, name, email, image, description, target_mrr, current_mrr, type, company_type, is_public, is_featured, created_at) VALUES
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', '6c3ccd93-7f8b-4093-a119-12a054e771bc', 'Emīls Pļavenieks', 'emils@plavenieks.lv', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 'Full-stack developer building innovative web applications', 44000, 15000, 'person', null, true, true, now() - interval '18 days'),
  ('0fa1b51e-6578-49b1-acfa-551a1cbc9f97', null, 'TechFlow Solutions', null, 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 'Cloud-based project management platform for modern teams', 50000, 32000, 'company', 'SaaS', true, true, now() - interval '16 days'),
  ('a4755b35-1d89-4bd0-836f-2365ec4a9a21', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97', 'Sarah Rodriguez', 'sarah@example.com', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', 'Digital marketing consultant helping businesses grow online', 8000, 5500, 'person', null, true, false, now() - interval '15 days'),
  ('550e8400-e29b-41d4-a716-446655440004', null, 'Creative Studio Pro', null, 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', 'Full-service creative agency specializing in brand identity and digital experiences', 35000, 28000, 'company', 'Agency', true, true, now() - interval '14 days'),
  ('550e8400-e29b-41d4-a716-446655440005', null, 'EcoStyle Boutique', null, 'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=400', 'Sustainable fashion retailer with eco-friendly clothing and accessories', 25000, 18000, 'company', 'Retail', true, false, now() - interval '12 days'),
  ('550e8400-e29b-41d4-a716-446655440006', null, 'The Growth Newsletter', null, 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400', 'Weekly insights on business growth, marketing strategies, and entrepreneurship', 12000, 8500, 'company', 'Newsletter', true, false, now() - interval '10 days'),
  ('550e8400-e29b-41d4-a716-446655440007', 'a4755b35-1d89-4bd0-836f-2365ec4a9a21', 'Demo Profile', 'demo@example.com', 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400', 'Demonstration profile showcasing platform features and capabilities', 15000, 3000, 'person', null, true, false, now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample connections
INSERT INTO connections (id, initiated_by, source_profile_id, destination_profile_id, type, status, net, is_public, show_net, created_at, approved_at, approved_by) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', '6c3ccd93-7f8b-4093-a119-12a054e771bc', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97', '6c3ccd93-7f8b-4093-a119-12a054e771bc', 'affiliate', 'approved', 2500, true, false, now() - interval '10 days', now() - interval '9 days', '6c3ccd93-7f8b-4093-a119-12a054e771bc'),
  ('550e8400-e29b-41d4-a716-446655440012', '6c3ccd93-7f8b-4093-a119-12a054e771bc', '550e8400-e29b-41d4-a716-446655440004', '6c3ccd93-7f8b-4093-a119-12a054e771bc', 'partner', 'approved', 3500, true, true, now() - interval '15 days', now() - interval '14 days', '6c3ccd93-7f8b-4093-a119-12a054e771bc'),
  ('550e8400-e29b-41d4-a716-446655440013', 'a4755b35-1d89-4bd0-836f-2365ec4a9a21', '550e8400-e29b-41d4-a716-446655440006', 'a4755b35-1d89-4bd0-836f-2365ec4a9a21', 'affiliate', 'approved', 1200, false, true, now() - interval '5 days', now() - interval '4 days', 'a4755b35-1d89-4bd0-836f-2365ec4a9a21'),
  ('550e8400-e29b-41d4-a716-446655440014', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97', 'a4755b35-1d89-4bd0-836f-2365ec4a9a21', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97', 'other', 'pending', 800, true, false, now() - interval '2 days', null, null),
  ('550e8400-e29b-41d4-a716-446655440015', '6c3ccd93-7f8b-4093-a119-12a054e771bc', '550e8400-e29b-41d4-a716-446655440005', '6c3ccd93-7f8b-4093-a119-12a054e771bc', 'affiliate', 'approved', 1800, true, true, now() - interval '8 days', now() - interval '7 days', '6c3ccd93-7f8b-4093-a119-12a054e771bc'),
  ('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97', 'affiliate', 'approved', 900, true, true, now() - interval '4 days', now() - interval '3 days', '0fa1b51e-6578-49b1-acfa-551a1cbc9f97'),
  ('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', 'partner', 'pending', 650, false, false, now() - interval '1 day', null, null),
  ('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'affiliate', 'approved', 750, true, false, now() - interval '6 days', now() - interval '5 days', '550e8400-e29b-41d4-a716-446655440007'),
  ('550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', 'other', 'approved', 420, true, true, now() - interval '3 days', now() - interval '2 days', '550e8400-e29b-41d4-a716-446655440007')
ON CONFLICT (id) DO NOTHING;

-- Insert sample profile views for analytics
INSERT INTO profile_views (profile_id, viewer_ip, viewed_at) VALUES
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', '192.168.1.1', now() - interval '1 hour'),
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', '192.168.1.2', now() - interval '2 hours'),
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', '192.168.1.3', now() - interval '1 day'),
  ('0fa1b51e-6578-49b1-acfa-551a1cbc9f97', '192.168.1.4', now() - interval '3 hours'),
  ('0fa1b51e-6578-49b1-acfa-551a1cbc9f97', '192.168.1.5', now() - interval '1 day'),
  ('a4755b35-1d89-4bd0-836f-2365ec4a9a21', '192.168.1.6', now() - interval '30 minutes'),
  ('550e8400-e29b-41d4-a716-446655440004', '192.168.1.7', now() - interval '4 hours'),
  ('550e8400-e29b-41d4-a716-446655440005', '192.168.1.8', now() - interval '2 days'),
  ('550e8400-e29b-41d4-a716-446655440006', '192.168.1.9', now() - interval '6 hours');

-- Update profile view counts based on sample data
UPDATE profiles SET view_count = (
  SELECT COUNT(*) FROM profile_views WHERE profile_views.profile_id = profiles.id
);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, data, created_at) VALUES
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', 'connection_request', 'New Connection Request', 'TechFlow Solutions wants to connect with you', '{"connection_id": "550e8400-e29b-41d4-a716-446655440011", "profile_name": "TechFlow Solutions"}', now() - interval '10 days'),
  ('6c3ccd93-7f8b-4093-a119-12a054e771bc', 'connection_approved', 'Connection Approved', 'Your connection with Creative Studio Pro has been approved', '{"connection_id": "550e8400-e29b-41d4-a716-446655440012", "profile_name": "Creative Studio Pro"}', now() - interval '14 days'),
  ('0fa1b51e-6578-49b1-acfa-551a1cbc9f97', 'connection_request', 'New Connection Request', 'Demo User wants to connect with you', '{"connection_id": "550e8400-e29b-41d4-a716-446655440014", "profile_name": "Demo User"}', now() - interval '2 days');