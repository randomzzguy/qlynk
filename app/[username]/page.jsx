import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { THEMES } from '@/lib/themeRegistry';

// This tells Next.js to generate pages dynamically
export const dynamic = 'force-dynamic';

export default async function PublicPage({ params }) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch page data from Supabase by joining with profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*, social_links(*), custom_links(*)')
    .eq('user_id', profile.id)
    .single();

  if (pageError || !page) {
    notFound(); // Show 404 page
  }

  // Get the theme configuration
  const themeConfig = THEMES[page.theme];

  // Fallback to quickpitch if theme not found
  if (!themeConfig) {
    console.warn(`Theme "${page.theme}" not found, falling back to quickpitch`);
    const QuickPitch = THEMES.quickpitch.component;
    return <QuickPitch data={{
      config_version: 'v1',
      headline: page.name || 'Welcome',
      subhead: page.tagline || page.profession || '',
      email: page.email || ''
    }} />;
  }

  // Get the theme component
  const ThemeComponent = themeConfig.component;

  // Merge theme_data with basic page fields
  // Theme components expect data from theme_data JSONB field
  const componentData = {
    ...page.theme_data, // Theme-specific data from JSONB
    // Add common fields that might be used across themes
    name: page.name,
    profession: page.profession,
    tagline: page.tagline,
    bio: page.bio,
    profileImage: page.profile_image,
    email: page.email,
    phone: page.phone,
    socialLinks: page.social_links || [],
    customLinks: page.custom_links || []
  };

  return <ThemeComponent data={componentData} />;
}