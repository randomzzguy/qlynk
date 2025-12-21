import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import {  
  ProfessionalTemplate,  
  CreativeTemplate,  
  MinimalistTemplate,  
  DarkTemplate,  
  VibrantTemplate, 
  socialIcons 
} from '@/components/Templates';

// This tells Next.js to generate pages dynamically
export const dynamic = 'force-dynamic';

export default async function PublicPage({ params }) {
  const { username } = params;
  const supabase = createClient();

  // Fetch page data from Supabase
  const { data: page, error } = await supabase
    .from('pages')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !page) {
    notFound(); // Show 404 page
  }

  // Map social links with icons
  const socialLinksWithIcons = page.social_links?.map(link => ({
    ...link,
    icon: socialIcons[link.platform]
  })) || [];

  // Format data for template
  const pageData = {
    name: page.name,
    profession: page.profession,
    tagline: page.tagline,
    bio: page.bio,
    profileImage: page.profile_image,
    email: page.email,
    phone: page.phone,
    cta: page.cta_text,
    ctaLink: page.cta_link,
    socialLinks: socialLinksWithIcons,
    links: page.custom_links || []
  };

  // Select the appropriate template component
  const templates = {
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    minimalist: MinimalistTemplate,
    dark: DarkTemplate,
    vibrant: VibrantTemplate,
  };

  const TemplateComponent = templates[page.theme] || ProfessionalTemplate;

  return <TemplateComponent data={pageData} />;
}