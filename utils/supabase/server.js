import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            // On the server cookieStore.set may not be available in some contexts
            if (typeof cookieStore.set === 'function') {
              cookieStore.set({ name, value, ...options })
            }
          } catch (error) {
            // ignore
          }
        },
        remove(name, options) {
          try {
            if (typeof cookieStore.set === 'function') {
              cookieStore.set({ name, value: '', ...options })
            }
          } catch (error) {
            // ignore
          }
        },
      },
    }
  )
}