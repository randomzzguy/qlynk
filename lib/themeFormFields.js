/**
 * Theme Form Field Definitions
 * Maps each theme to its form fields with proper types, labels, and validation
 */

export const THEME_FORM_FIELDS = {
    // ============================================================================
    // FREELANCER THEMES
    // ============================================================================
    quickpitch: [
        { name: 'headline', type: 'text', required: true, label: 'Headline', placeholder: 'Your main pitch', maxLength: 100 },
        { name: 'subhead', type: 'text', required: true, label: 'Subheadline', placeholder: 'Supporting message', maxLength: 200 },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        { name: 'calendlyUrl', type: 'url', required: false, label: 'Calendly URL', placeholder: 'https://calendly.com/yourname', helperText: 'Optional: Add your booking link' },
        {
            name: 'services',
            type: 'array',
            required: false,
            label: 'Services',
            maxItems: 3,
            itemFields: [
                { name: 'title', type: 'text', label: 'Service Name', maxLength: 100 },
                { name: 'desc', type: 'textarea', label: 'Description', maxLength: 200 }
            ]
        },
        {
            name: 'testimonials',
            type: 'array',
            required: false,
            label: 'Testimonials',
            maxItems: 3,
            itemFields: [
                { name: 'quote', type: 'textarea', label: 'Quote', maxLength: 500 },
                { name: 'name', type: 'text', label: 'Client Name', maxLength: 100 },
                { name: 'role', type: 'text', label: 'Client Role', maxLength: 100 }
            ]
        }
    ],

    skillstack: [
        { name: 'bio', type: 'textarea', required: true, label: 'Bio', placeholder: 'Tell us about yourself...', maxLength: 500 },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        { name: 'resumeUrl', type: 'url', required: false, label: 'Resume URL', placeholder: 'https://...', helperText: 'Link to your resume/CV' },
        { name: 'github', type: 'url', required: false, label: 'GitHub URL', placeholder: 'https://github.com/username' },
        { name: 'linkedin', type: 'url', required: false, label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
        {
            name: 'skills',
            type: 'array',
            required: false,
            label: 'Skills',
            maxItems: 10,
            itemFields: [
                { name: 'name', type: 'text', label: 'Skill Name', maxLength: 50 },
                { name: 'level', type: 'number', label: 'Proficiency (0-100)', min: 0, max: 100 }
            ]
        },
        {
            name: 'projects',
            type: 'array',
            required: false,
            label: 'Projects',
            maxItems: 6,
            itemFields: [
                { name: 'title', type: 'text', label: 'Project Title', maxLength: 100 },
                { name: 'desc', type: 'textarea', label: 'Description', maxLength: 200 },
                { name: 'image', type: 'text', label: 'Image URL (optional)', placeholder: 'https://...' },
                { name: 'tech', type: 'tags', label: 'Technologies', placeholder: 'React, Node.js, etc.' }
            ]
        }
    ],

    hiremenow: [
        { name: 'available', type: 'boolean', required: true, label: 'Currently Available', defaultValue: true },
        { name: 'email', type: 'email', required: false, label: 'Email', placeholder: 'your@email.com' },
        { name: 'calendlyUrl', type: 'url', required: false, label: 'Booking URL', placeholder: 'https://calendly.com/yourname' },
        {
            name: 'offer',
            type: 'object',
            required: false,
            label: 'Limited Time Offer',
            fields: [
                { name: 'title', type: 'text', label: 'Offer Title', maxLength: 100 },
                { name: 'desc', type: 'textarea', label: 'Description', maxLength: 200 },
                { name: 'expiry', type: 'date', label: 'Expiry Date' }
            ]
        },
        {
            name: 'pricingTiers',
            type: 'array',
            required: false,
            label: 'Pricing Tiers',
            maxItems: 3,
            itemFields: [
                { name: 'name', type: 'text', label: 'Tier Name', maxLength: 50 },
                { name: 'price', type: 'text', label: 'Price', maxLength: 50, placeholder: '$99/hr' },
                { name: 'features', type: 'tags', label: 'Features', placeholder: 'Feature 1, Feature 2' }
            ]
        }
    ],

    storybuilder: [
        { name: 'manifesto', type: 'textarea', required: true, label: 'Your Philosophy/Manifesto', placeholder: 'What drives you...', maxLength: 500 },
        { name: 'ctaText', type: 'text', required: false, label: 'Call to Action Text', maxLength: 50, placeholder: "Let's Work Together" },
        { name: 'ctaLink', type: 'url', required: false, label: 'CTA Link', placeholder: 'https://...' },
        {
            name: 'storyBlocks',
            type: 'array',
            required: false,
            label: 'Story Blocks',
            maxItems: 10,
            itemFields: [
                { name: 'type', type: 'select', label: 'Block Type', options: ['text', 'image'] },
                { name: 'content', type: 'textarea', label: 'Content', maxLength: 1000 }
            ]
        },
        {
            name: 'caseSnippets',
            type: 'array',
            required: false,
            label: 'Before/After Case Studies',
            maxItems: 5,
            itemFields: [
                { name: 'title', type: 'text', label: 'Case Title', maxLength: 100 },
                { name: 'before', type: 'textarea', label: 'Before', maxLength: 200 },
                { name: 'after', type: 'textarea', label: 'After', maxLength: 200 }
            ]
        }
    ],

    localpro: [
        { name: 'serviceArea', type: 'text', required: true, label: 'Service Area', placeholder: 'Austin, TX', maxLength: 100 },
        { name: 'phone', type: 'tel', required: true, label: 'Phone Number', placeholder: '(512) 555-0123' },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        { name: 'since', type: 'text', required: false, label: 'In Business Since', placeholder: '2010', maxLength: 10 },
        { name: 'mapEmbedUrl', type: 'url', required: false, label: 'Google Maps Embed URL', helperText: 'Optional: Embed a map of your location' },
        {
            name: 'gallery',
            type: 'array',
            required: false,
            label: 'Project Gallery',
            maxItems: 8,
            itemFields: [
                { name: 'location', type: 'text', label: 'Location', maxLength: 100 },
                { name: 'alt', type: 'text', label: 'Description', maxLength: 100 },
                { name: 'url', type: 'text', label: 'Image URL (optional)', placeholder: 'https://...' }
            ]
        },
        {
            name: 'reviews',
            type: 'array',
            required: false,
            label: 'Customer Reviews',
            maxItems: 6,
            itemFields: [
                { name: 'text', type: 'textarea', label: 'Review', maxLength: 500 },
                { name: 'name', type: 'text', label: 'Customer Name', maxLength: 100 },
                { name: 'location', type: 'text', label: 'Location', maxLength: 100 },
                { name: 'rating', type: 'number', label: 'Rating (1-5)', min: 1, max: 5 }
            ]
        },
        {
            name: 'faq',
            type: 'array',
            required: false,
            label: 'FAQ',
            maxItems: 10,
            itemFields: [
                { name: 'q', type: 'text', label: 'Question', maxLength: 200 },
                { name: 'a', type: 'textarea', label: 'Answer', maxLength: 500 }
            ]
        }
    ],

    sidehustle: [
        { name: 'intro', type: 'text', required: true, label: 'Introduction', placeholder: 'Hey! I do...', maxLength: 200 },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        {
            name: 'offers',
            type: 'array',
            required: false,
            label: 'What You Offer',
            maxItems: 6,
            itemFields: [
                { name: 'title', type: 'text', label: 'Service', maxLength: 50 },
                { name: 'emoji', type: 'text', label: 'Emoji', maxLength: 10, placeholder: '🎨' },
                { name: 'desc', type: 'textarea', label: 'Description', maxLength: 200 }
            ]
        },
        {
            name: 'funFacts',
            type: 'array',
            required: false,
            label: 'Fun Stats',
            maxItems: 5,
            itemFields: [
                { name: 'label', type: 'text', label: 'Label', maxLength: 50 },
                { name: 'value', type: 'text', label: 'Value', maxLength: 20 }
            ]
        },
        {
            name: 'socials',
            type: 'object',
            required: false,
            label: 'Social Links',
            fields: [
                { name: 'instagram', type: 'url', label: 'Instagram', placeholder: 'https://instagram.com/username' },
                { name: 'twitter', type: 'url', label: 'Twitter', placeholder: 'https://twitter.com/username' },
                { name: 'linkedin', type: 'url', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' }
            ]
        }
    ],

    // ============================================================================
    // PORTFOLIO THEMES
    // ============================================================================
    gallerygrid: [
        { name: 'intro', type: 'textarea', required: true, label: 'Introduction', placeholder: 'Tell visitors about your work...', maxLength: 200 },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        { name: 'about', type: 'textarea', required: false, label: 'About Section', maxLength: 500 },
        { name: 'instagram', type: 'text', required: false, label: 'Instagram Handle', placeholder: '@username', maxLength: 50 },
        {
            name: 'projects',
            type: 'array',
            required: false,
            label: 'Projects',
            maxItems: 20,
            itemFields: [
                { name: 'title', type: 'text', label: 'Title', maxLength: 100 },
                { name: 'category', type: 'text', label: 'Category', maxLength: 50 },
                { name: 'tags', type: 'tags', label: 'Tags', placeholder: 'portrait, nature, etc.' },
                { name: 'featured', type: 'text', label: 'Image/Emoji', placeholder: '📸 or https://...' }
            ]
        }
    ],

    casestudy: [
        { name: 'intro', type: 'textarea', required: true, label: 'Introduction', placeholder: 'What you do...', maxLength: 200 },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        { name: 'docsUrl', type: 'url', required: false, label: 'Portfolio/Docs URL', placeholder: 'https://...' },
        {
            name: 'tools',
            type: 'tags',
            required: false,
            label: 'Tools & Technologies',
            placeholder: 'Figma, React, etc.'
        },
        {
            name: 'caseStudies',
            type: 'array',
            required: false,
            label: 'Case Studies',
            maxItems: 5,
            itemFields: [
                { name: 'title', type: 'text', label: 'Project Title', maxLength: 100 },
                { name: 'heroImage', type: 'text', label: 'Hero Image URL (optional)', placeholder: 'https://...' },
                { name: 'challenge', type: 'textarea', label: 'Challenge', maxLength: 1000 },
                { name: 'process', type: 'textarea', label: 'Process', maxLength: 1000 },
                { name: 'solution', type: 'textarea', label: 'Solution', maxLength: 1000 },
                {
                    name: 'results',
                    type: 'subarray',
                    label: 'Results',
                    maxItems: 5,
                    itemFields: [
                        { name: 'metric', type: 'text', label: 'Metric', maxLength: 50 },
                        { name: 'value', type: 'text', label: 'Value', maxLength: 50 }
                    ]
                }
            ]
        }
    ],

    minimalistcv: [
        { name: 'name', type: 'text', required: true, label: 'Full Name', maxLength: 100 },
        { name: 'role', type: 'text', required: true, label: 'Role/Title', maxLength: 100 },
        { name: 'headline', type: 'text', required: true, label: 'Headline', maxLength: 200 },
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        { name: 'resumeUrl', type: 'url', required: false, label: 'Resume PDF URL', placeholder: 'https://...' },
        {
            name: 'featuredProject',
            type: 'object',
            required: false,
            label: 'Featured Project',
            fields: [
                { name: 'title', type: 'text', label: 'Title', maxLength: 100 },
                { name: 'link', type: 'url', label: 'Link' },
                { name: 'image', type: 'text', label: 'Image URL (optional)', placeholder: 'https://...' },
                { name: 'desc', type: 'textarea', label: 'Description', maxLength: 200 }
            ]
        },
        {
            name: 'skills',
            type: 'array',
            required: false,
            label: 'Skills',
            maxItems: 10,
            itemFields: [
                { name: 'name', type: 'text', label: 'Skill', maxLength: 50 },
                { name: 'proficiency', type: 'number', label: 'Proficiency (0-100)', min: 0, max: 100 }
            ]
        },
        {
            name: 'experience',
            type: 'array',
            required: false,
            label: 'Work Experience',
            maxItems: 10,
            itemFields: [
                { name: 'company', type: 'text', label: 'Company', maxLength: 100 },
                { name: 'role', type: 'text', label: 'Role', maxLength: 100 },
                { name: 'dates', type: 'text', label: 'Dates', maxLength: 50, placeholder: '2020 - 2023' },
                { name: 'bullets', type: 'tags', label: 'Key Achievements', placeholder: 'Achievement 1, Achievement 2' }
            ]
        },
        {
            name: 'education',
            type: 'array',
            required: false,
            label: 'Education',
            maxItems: 5,
            itemFields: [
                { name: 'school', type: 'text', label: 'School', maxLength: 100 },
                { name: 'degree', type: 'text', label: 'Degree', maxLength: 100 },
                { name: 'year', type: 'text', label: 'Year', maxLength: 10 }
            ]
        }
    ],

    motionreel: [
        { name: 'email', type: 'email', required: true, label: 'Email', placeholder: 'your@email.com' },
        {
            name: 'heroReel',
            type: 'object',
            required: false,
            label: 'Hero Reel',
            fields: [
                { name: 'url', type: 'url', label: 'Video URL (optional)', placeholder: 'https://...' },
                { name: 'poster', type: 'text', label: 'Poster Image URL (optional)', placeholder: 'https://...' }
            ]
        },
        {
            name: 'projects',
            type: 'array',
            required: false,
            label: 'Video Projects',
            maxItems: 12,
            itemFields: [
                { name: 'title', type: 'text', label: 'Title', maxLength: 100 },
                { name: 'thumbnail', type: 'text', label: 'Thumbnail URL (optional)', placeholder: 'https://...' },
                { name: 'videoUrl', type: 'url', label: 'Video URL (optional)', placeholder: 'https://...' },
                { name: 'duration', type: 'text', label: 'Duration', maxLength: 10, placeholder: '2:30' }
            ]
        },
        {
            name: 'bts',
            type: 'array',
            required: false,
            label: 'Behind the Scenes',
            maxItems: 6,
            itemFields: [
                { name: 'caption', type: 'textarea', label: 'Caption', maxLength: 200 },
                { name: 'media', type: 'text', label: 'Image/Video URL (optional)', placeholder: 'https://...' }
            ]
        }
    ],

    interactivedemo: [
        { name: 'githubUrl', type: 'url', required: true, label: 'GitHub URL', placeholder: 'https://github.com/username' },
        {
            name: 'heroDemo',
            type: 'object',
            required: false,
            label: 'Hero Demo',
            fields: [
                { name: 'url', type: 'url', label: 'Demo URL (optional)', placeholder: 'https://...' },
                { name: 'title', type: 'text', label: 'Title', maxLength: 100 }
            ]
        },
        {
            name: 'demos',
            type: 'array',
            required: false,
            label: 'Interactive Demos',
            maxItems: 10,
            itemFields: [
                { name: 'title', type: 'text', label: 'Title', maxLength: 100 },
                { name: 'embedUrl', type: 'url', label: 'Embed URL (optional)', placeholder: 'https://codepen.io/...' },
                { name: 'tech', type: 'tags', label: 'Technologies', placeholder: 'WebGL, Three.js, etc.' }
            ]
        },
        {
            name: 'snippets',
            type: 'array',
            required: false,
            label: 'Code Snippets',
            maxItems: 10,
            itemFields: [
                { name: 'language', type: 'text', label: 'Language', maxLength: 50, placeholder: 'javascript' },
                { name: 'code', type: 'textarea', label: 'Code', maxLength: 2000 }
            ]
        }
    ],

    narrativescroll: [
        {
            name: 'epilogue',
            type: 'object',
            required: true,
            label: 'Epilogue (Final Section)',
            fields: [
                { name: 'text', type: 'textarea', label: 'Epilogue Text', maxLength: 500 },
                { name: 'ctaText', type: 'text', label: 'CTA Button Text', maxLength: 100 },
                { name: 'ctaLink', type: 'url', label: 'CTA Link', placeholder: 'https://...' }
            ]
        },
        {
            name: 'chapters',
            type: 'array',
            required: false,
            label: 'Story Chapters',
            maxItems: 10,
            itemFields: [
                { name: 'title', type: 'text', label: 'Chapter Title', maxLength: 50 },
                { name: 'body', type: 'textarea', label: 'Chapter Content', maxLength: 1000 },
                { name: 'bgImage', type: 'text', label: 'Background Image URL (optional)', placeholder: 'https://...' }
            ]
        },
        {
            name: 'artifacts',
            type: 'array',
            required: false,
            label: 'Portfolio Artifacts',
            maxItems: 10,
            itemFields: [
                { name: 'title', type: 'text', label: 'Title', maxLength: 100 },
                { name: 'link', type: 'url', label: 'Link' }
            ]
        }
    ]

    // Note: Product and Business themes would follow the same pattern
    // I'll add them if needed, but this shows the complete structure
};

export const getThemeFormFields = (themeId) => {
    return THEME_FORM_FIELDS[themeId] || [];
};
