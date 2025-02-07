import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cykmukqcmyeayvfaavfx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5a211a3FjbXllYXl2ZmFhdmZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDY5MTIsImV4cCI6MjA1NDQ4MjkxMn0.ZObaRxQgu_eWt3Y7Cu9OAaQrpVwmBam1p7FRjH9DDXE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);