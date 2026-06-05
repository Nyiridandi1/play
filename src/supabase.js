import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://gmqqervxdnxjwmkmorbl.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtcXFlcnZ4ZG54andta21vcmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NzMwNTksImV4cCI6MjA5NjE0OTA1OX0.X-jP3H5tuySYkJKFa1EOQ58JxyHmo0_LdEdftAE0FLY"

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)