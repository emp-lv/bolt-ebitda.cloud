import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log environment variables for debugging (remove in production)
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile from our users table
export const getUserProfile = async (supabaseId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('supabase_id', supabaseId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }
  
  return data;
};

// Helper function to create user profile in our users table
export const createUserProfile = async (user: any, name: string) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      supabase_id: user.id,
      email: user.email,
      name: name,
      email_verified: user.email_confirmed_at ? true : false,
      last_sign_in: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export { supabaseUrl }