import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://gmqqervxdnxjwmkmorbl.supabase.co"
const SUPABASE_KEY = "sb_publishable_IxRHy0bgZYVvmdPAokeaow_fievHMuF"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)