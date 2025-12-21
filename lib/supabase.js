import { createClient as createClientBrowser } from '@/utils/supabase/client'

// Lightweight client-side wrappers for common Supabase operations
export const getCurrentUser = async () => {
  try {
    const supabase = createClientBrowser()
    const { data } = await supabase.auth.getUser()
    return data?.user || null
  } catch (err) {
    console.error('getCurrentUser error', err)
    return null
  }
}

export const signOut = async () => {
  try {
    const supabase = createClientBrowser()
    await supabase.auth.signOut()
  } catch (err) {
    console.error('signOut error', err)
  }
}

export const getCurrentProfile = async () => {
  try {
    const supabase = createClientBrowser()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile || null
  } catch (err) {
    console.error('getCurrentProfile error', err)
    return null
  }
}

export const getUserPage = async () => {
  try {
    const supabase = createClientBrowser()
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user
    if (!user) return { data: null }

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('owner', user.id)
      .single()

    return { data, error }
  } catch (err) {
    console.error('getUserPage error', err)
    return { data: null, error: err }
  }
}

export const createPage = async (pageData) => {
  try {
    const supabase = createClientBrowser()

    // Insert minimal page row. Adjust fields as needed by your schema.
    const { data, error } = await supabase
      .from('pages')
      .insert([{ ...pageData }])
      .select()

    return { data: data?.[0] || null, error }
  } catch (err) {
    console.error('createPage error', err)
    return { data: null, error: err }
  }
}

export default {
  getCurrentUser,
  signOut,
  getCurrentProfile,
  getUserPage,
  createPage,
}
