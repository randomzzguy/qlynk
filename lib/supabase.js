// ============================================
// SUPABASE CLIENT SETUP
// File: lib/supabase.js
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// AUTH FUNCTIONS
// ============================================

/**
 * Sign up a new user
 */
export const signUp = async (email, password, username, hcaptchaToken) => {
  try {
    // 1. Verify hCaptcha token
    const captchaVerification = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `response=${hcaptchaToken}&secret=YOUR_HCAPTCHA_SECRET_KEY`,
    });
    const captchaResult = await captchaVerification.json();
    if (!captchaResult.success) {
        return { error: { message: 'hCaptcha verification failed.' } };
    }

    // 2. Check if username is available
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (existingUser) {
      return { error: { message: 'Username already taken' } };
    }

    // 3. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
        }
      }
    });

    if (authError) return { error: authError };

    return { data: { user: authData.user }, error: null };
  } catch (error) {
    return { error };
  }
};

/**
 * Sign in existing user
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get current user session
 */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Get current user profile
 */
export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return data;
};

// ============================================
// PAGE FUNCTIONS
// ============================================

/**
 * Create a new page
 */
export const createPage = async (pageData) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    // Ensure profile exists to satisfy foreign key constraints
    let profile = await getCurrentProfile();
    if (!profile) {
      const baseCandidate = (user.email?.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '');
      let username = (pageData.preferredUsername?.toLowerCase()?.replace(/[^a-z0-9_-]/g, '') || baseCandidate) || `user-${(user.id || '').slice(0, 8)}`;

      // Ensure uniqueness if needed
      const available = await checkUsernameAvailable(username);
      if (!available) {
        username = `${baseCandidate}-${Math.random().toString(36).slice(2, 6)}`;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username,
            email: user.email,
          },
        ])
        .select()
        .single();

      if (profileError) return { error: profileError };
      profile = profileData;
    }

    // Insert main page data
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert([
        {
          user_id: user.id,
          name: pageData.name,
          profession: pageData.profession,
          tagline: pageData.tagline,
          bio: pageData.bio,
          profile_image: pageData.profileImage,
          email: pageData.email,
          phone: pageData.phone,
          cta_text: pageData.cta,
          cta_link: pageData.ctaLink,
          theme: pageData.theme,
          is_published: true,
        },
      ])
      .select()
      .single();

    if (pageError) return { error: pageError };

    // Insert social links
    if (pageData.socialLinks && pageData.socialLinks.length > 0) {
      const socialLinksData = pageData.socialLinks.map((link, index) => ({
        page_id: page.id,
        platform: link.platform,
        url: link.url,
        display_order: index,
      }));

      const { error: socialError } = await supabase
        .from('social_links')
        .insert(socialLinksData);

      if (socialError) console.error('Social links error:', socialError);
    }

    // Insert custom links
    if (pageData.links && pageData.links.length > 0) {
      const customLinksData = pageData.links.map((link, index) => ({
        page_id: page.id,
        title: link.title,
        url: link.url,
        description: link.description,
        display_order: index,
      }));

      const { error: linksError } = await supabase
        .from('custom_links')
        .insert(customLinksData);

      if (linksError) console.error('Custom links error:', linksError);
    }

    // Return page along with username for convenience
    return { data: { ...page, username: profile?.username }, error: null };
  } catch (error) {
    return { error };
  }
};

/**
 * Update an existing page
 */
export const updatePage = async (pageId, pageData) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    // Update main page data
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .update({
        name: pageData.name,
        profession: pageData.profession,
        tagline: pageData.tagline,
        bio: pageData.bio,
        profile_image: pageData.profileImage,
        email: pageData.email,
        phone: pageData.phone,
        cta_text: pageData.cta,
        cta_link: pageData.ctaLink,
        theme: pageData.theme,
      })
      .eq('id', pageId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (pageError) return { error: pageError };

    // Delete existing social links and insert new ones
    await supabase.from('social_links').delete().eq('page_id', pageId);

    if (pageData.socialLinks && pageData.socialLinks.length > 0) {
      const socialLinksData = pageData.socialLinks.map((link, index) => ({
        page_id: pageId,
        platform: link.platform,
        url: link.url,
        display_order: index,
      }));

      await supabase.from('social_links').insert(socialLinksData);
    }

    // Delete existing custom links and insert new ones
    await supabase.from('custom_links').delete().eq('page_id', pageId);

    if (pageData.links && pageData.links.length > 0) {
      const customLinksData = pageData.links.map((link, index) => ({
        page_id: pageId,
        title: link.title,
        url: link.url,
        description: link.description,
        display_order: index,
      }));

      await supabase.from('custom_links').insert(customLinksData);
    }

    return { data: page, error: null };
  } catch (error) {
    return { error };
  }
};

/**
 * Get user's page
 */
export const getUserPage = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, error: null };

    const { data, error } = await supabase
      .from('complete_pages')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Get page by username (for public viewing)
 */
export const getPageByUsername = async (username) => {
  try {
    // Try view first if available
    const { data: viewData, error: viewError } = await supabase
      .from('complete_pages')
      .select('*')
      .eq('username', username.toLowerCase())
      .eq('is_published', true)
      .single();

    if (viewData && !viewError) {
      // Increment page views (best-effort)
      try { await supabase.rpc('increment_page_views', { page_uuid: viewData.id }); } catch {}
      return { data: viewData, error: null };
    }

    // Fallback: assemble from base tables
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username.toLowerCase())
      .single();

    if (profileError || !profile) {
      return { data: null, error: profileError || { message: 'Profile not found' } };
    }

    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('user_id', profile.id)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (pagesError || !pages || pages.length === 0) {
      return { data: null, error: pagesError || { message: 'Published page not found' } };
    }

    const page = pages[0];

    const { data: social_links } = await supabase
      .from('social_links')
      .select('*')
      .eq('page_id', page.id);

    const { data: custom_links } = await supabase
      .from('custom_links')
      .select('*')
      .eq('page_id', page.id);

    const assembled = {
      ...page,
      username: profile.username,
      social_links: social_links || [],
      custom_links: custom_links || [],
    };

    // Best-effort view tracking
    try { await supabase.rpc('increment_page_views', { page_uuid: page.id }); } catch {}

    return { data: assembled, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

/**
 * Delete user's page
 */
export const deletePage = async (pageId) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { error: { message: 'Not authenticated' } };

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', pageId)
      .eq('user_id', user.id);

    return { error };
  } catch (error) {
    return { error };
  }
};

/**
 * Check if username is available
 */
export const checkUsernameAvailable = async (username) => {
  const { data } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  return !data; // Returns true if available (no data found)
};

// ============================================
// ANALYTICS FUNCTIONS
// ============================================

/**
 * Track page view
 */
export const trackPageView = async (pageId, referrer = null) => {
  try {
    await supabase.from('page_analytics').insert([
      {
        page_id: pageId,
        event_type: 'view',
        referrer: referrer,
      },
    ]);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

/**
 * Track link click
 */
export const trackLinkClick = async (pageId, eventType = 'link_click') => {
  try {
    await supabase.from('page_analytics').insert([
      {
        page_id: pageId,
        event_type: eventType,
      },
    ]);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

/**
 * Get analytics for user's page
 */
export const getPageAnalytics = async (pageId) => {
  try {
    const user = await getCurrentUser();
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    // Get total views
    const { count: totalViews } = await supabase
      .from('page_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('page_id', pageId)
      .eq('event_type', 'view');

    // Get views in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: recentViews } = await supabase
      .from('page_analytics')
      .select('*', { count: 'exact', head: true })
      .eq('page_id', pageId)
      .eq('event_type', 'view')
      .gte('created_at', thirtyDaysAgo.toISOString());

    return {
      data: {
        totalViews: totalViews || 0,
        last30Days: recentViews || 0,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format page data from database to form format
 */
export const formatPageDataForForm = (dbData) => {
  if (!dbData) return null;

  return {
    name: dbData.name,
    profession: dbData.profession,
    tagline: dbData.tagline,
    bio: dbData.bio,
    profileImage: dbData.profile_image,
    email: dbData.email,
    phone: dbData.phone,
    cta: dbData.cta_text,
    ctaLink: dbData.cta_link,
    theme: dbData.theme,
    socialLinks: dbData.social_links || [],
    links: dbData.custom_links || [],
  };
};
export const checkSupabaseConnectivity = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    return { ok: true, session: !!session?.session, profilesCountKnown: typeof count === 'number' };
  } catch (error) {
    return { ok: false, error };
  }
};