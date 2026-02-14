import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function getMemberContent(tier) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .lte('required_tier', tier)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getUserSoulMap(userId) {
  const { data, error } = await supabase
    .from('soul_maps')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
}
