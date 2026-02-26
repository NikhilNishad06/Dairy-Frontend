import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sdssnoozsejdnmifgzbh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc3Nub296c2VqZG5taWZnemJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTMzNTQsImV4cCI6MjA4Mzc2OTM1NH0.Qwgf1QxOrQ_k7--h4g9UVHBx7344PNPmvXUI-bkCvNg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
