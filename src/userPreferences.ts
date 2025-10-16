import { supabase } from './supabaseClient';

const getUserId = (): string => {
  let userId = localStorage.getItem('roteiro_user_id');

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('roteiro_user_id', userId);
  }

  return userId;
};

export const loadVoiceButtonPreference = async (): Promise<boolean> => {
  try {
    const userId = getUserId();

    const { data, error } = await supabase
      .from('user_preferences')
      .select('voice_buttons_enabled')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error loading voice button preference:', error);
      return true;
    }

    return data?.voice_buttons_enabled ?? true;
  } catch (err) {
    console.error('Error loading voice button preference:', err);
    return true;
  }
};

export const saveVoiceButtonPreference = async (enabled: boolean): Promise<void> => {
  try {
    const userId = getUserId();

    const { error } = await supabase
      .from('user_preferences')
      .upsert(
        {
          user_id: userId,
          voice_buttons_enabled: enabled,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id'
        }
      );

    if (error) {
      console.error('Error saving voice button preference:', error);
    }
  } catch (err) {
    console.error('Error saving voice button preference:', err);
  }
};
