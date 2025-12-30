import { createClient } from '@/utils/supabase/server';
import { THEMES } from '@/lib/themeRegistry';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

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
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center text-center px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#f46530]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="text-[#f46530]" size={40} />
          </div>
          <h1 className="text-4xl font-black text-[#2a2e30] mb-2">
            @{username} is available!
          </h1>
          <p className="text-xl text-[#474c4e]">
            This handle hasn&apos;t been claimed yet. It could be yours.
          </p>
        </div>
        
        <Link 
          href="/auth/signup" 
          className="inline-flex items-center gap-2 bg-[#f46530] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#c14f22] transition-all hover:shadow-lg hover:shadow-[#f46530]/30 hover:-translate-y-0.5"
        >
          Claim This Handle
          <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*, social_links(*), custom_links(*)')
    .eq('user_id', profile.id)
    .single();

  if (pageError || !page) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-[#2a2e30] mb-4">
          Page Under Construction
        </h1>
        <p className="text-[#474c4e] mb-8">
          @{username} hasn&apos;t published their page yet. Check back soon!
        </p>
        <Link href="/" className="text-[#f46530] font-semibold hover:underline">
          Create your own page on qlynk
        </Link>
      </div>
    );
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