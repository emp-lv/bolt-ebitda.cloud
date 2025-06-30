/*
  # Create User Profile Function

  1. New Function
    - `create_user_profile` - Creates a new user profile in the users table
    - Handles duplicate emails by updating existing records
    - Returns the created or updated user profile

  2. Security
    - Function is marked as SECURITY DEFINER to run with elevated privileges
    - Accessible to authenticated users only
*/

-- Function to create a user profile
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id uuid,
  user_email text,
  user_name text,
  is_verified boolean DEFAULT false,
  avatar text DEFAULT null
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- Check if user already exists with this supabase_id
  SELECT id INTO new_user_id FROM users WHERE supabase_id = user_id;
  
  IF new_user_id IS NULL THEN
    -- Check if user exists with this email but different supabase_id (account migration)
    SELECT id INTO new_user_id FROM users WHERE email = user_email;
    
    IF new_user_id IS NULL THEN
      -- Create new user
      INSERT INTO users (
        supabase_id,
        email,
        name,
        email_verified,
        avatar_url,
        last_sign_in
      ) VALUES (
        user_id,
        user_email,
        user_name,
        is_verified,
        avatar,
        now()
      )
      RETURNING id INTO new_user_id;
    ELSE
      -- Update existing user with new supabase_id (account migration)
      UPDATE users
      SET 
        supabase_id = user_id,
        name = COALESCE(user_name, name),
        email_verified = COALESCE(is_verified, email_verified),
        avatar_url = COALESCE(avatar, avatar_url),
        last_sign_in = now()
      WHERE id = new_user_id;
    END IF;
  ELSE
    -- Update existing user
    UPDATE users
    SET 
      email = user_email,
      name = COALESCE(user_name, name),
      email_verified = COALESCE(is_verified, email_verified),
      avatar_url = COALESCE(avatar, avatar_url),
      last_sign_in = now()
    WHERE id = new_user_id;
  END IF;
  
  -- Return the user data
  SELECT row_to_json(u) INTO result
  FROM users u
  WHERE u.id = new_user_id;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;