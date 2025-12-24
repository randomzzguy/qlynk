import { z } from 'zod';

/**
 * Zod Schemas for Theme Validation
 * Each theme has its own schema defining required and optional fields
 * All schemas include config_version for future migration safety
 */

// ============================================================================
// FREELANCER THEMES
// ============================================================================

export const QuickPitchSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    headline: z.string().min(1, 'Headline is required').max(100),
    subhead: z.string().min(1, 'Subhead is required').max(200),
    email: z.string().email('Valid email is required'),

    // Optional fields
    calendlyUrl: z.string().url().optional().or(z.literal('')),
    services: z.array(z.object({
        title: z.string().min(1).max(100),
        desc: z.string().min(1).max(200)
    })).max(3).optional().default([]),
    testimonials: z.array(z.object({
        quote: z.string().min(1).max(500),
        name: z.string().min(1).max(100),
        role: z.string().min(1).max(100)
    })).max(3).optional().default([])
});

export const SkillStackSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    bio: z.string().min(1, 'Bio is required').max(500),
    email: z.string().email('Valid email is required'),

    // Optional fields
    skills: z.array(z.object({
        name: z.string().min(1).max(50),
        level: z.number().min(0).max(100)
    })).max(10).optional().default([]),
    projects: z.array(z.object({
        title: z.string().min(1).max(100),
        desc: z.string().min(1).max(200),
        image: z.string().optional(),
        tech: z.array(z.string()).max(10)
    })).max(6).optional().default([]),
    resumeUrl: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal(''))
});

export const HireMeNowSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    available: z.boolean().default(true),

    // Optional fields
    offer: z.object({
        title: z.string().max(100),
        desc: z.string().max(200),
        expiry: z.string() // ISO date string
    }).optional(),
    pricingTiers: z.array(z.object({
        name: z.string().min(1).max(50),
        price: z.string().min(1).max(50),
        features: z.array(z.string()).max(10)
    })).max(3).optional().default([]),
    calendlyUrl: z.string().url().optional().or(z.literal('')),
    email: z.string().email().optional()
});

export const StoryBuilderSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    manifesto: z.string().min(1, 'Philosophy/manifesto is required').max(500),

    // Optional fields
    storyBlocks: z.array(z.object({
        type: z.enum(['text', 'image']),
        content: z.string()
    })).max(10).optional().default([]),
    caseSnippets: z.array(z.object({
        title: z.string().min(1).max(100),
        before: z.string().min(1).max(200),
        after: z.string().min(1).max(200)
    })).max(5).optional().default([]),
    ctaText: z.string().max(50).optional(),
    ctaLink: z.string().url().optional().or(z.literal(''))
});

export const LocalProSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    serviceArea: z.string().min(1, 'Service area is required').max(100),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Valid email is required'),

    // Optional fields
    since: z.string().max(10).optional(),
    gallery: z.array(z.object({
        location: z.string().max(100),
        alt: z.string().max(100),
        url: z.string().url().optional()
    })).max(8).optional().default([]),
    reviews: z.array(z.object({
        text: z.string().min(1).max(500),
        name: z.string().min(1).max(100),
        location: z.string().max(100),
        rating: z.number().min(1).max(5)
    })).max(6).optional().default([]),
    faq: z.array(z.object({
        q: z.string().min(1).max(200),
        a: z.string().min(1).max(500)
    })).max(10).optional().default([]),
    mapEmbedUrl: z.string().url().optional().or(z.literal(''))
});

export const SideHustleSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    intro: z.string().min(1, 'Intro is required').max(200),
    email: z.string().email('Valid email is required'),

    // Optional fields
    offers: z.array(z.object({
        title: z.string().min(1).max(50),
        emoji: z.string().max(10),
        desc: z.string().min(1).max(200)
    })).max(6).optional().default([]),
    funFacts: z.array(z.object({
        label: z.string().min(1).max(50),
        value: z.string().min(1).max(20)
    })).max(5).optional().default([]),
    socials: z.object({
        instagram: z.string().url().optional(),
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional()
    }).optional()
});

// ============================================================================
// PORTFOLIO THEMES
// ============================================================================

export const GalleryGridSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    intro: z.string().min(1, 'Intro is required').max(200),
    email: z.string().email('Valid email is required'),

    // Optional fields
    projects: z.array(z.object({
        title: z.string().min(1).max(100),
        category: z.string().max(50),
        tags: z.array(z.string()).max(10),
        featured: z.string().optional() // emoji or image URL
    })).max(20).optional().default([]),
    about: z.string().max(500).optional(),
    instagram: z.string().max(50).optional()
});

export const CaseStudySchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    intro: z.string().min(1, 'Intro is required').max(200),
    email: z.string().email('Valid email is required'),

    // Optional fields
    caseStudies: z.array(z.object({
        title: z.string().min(1).max(100),
        heroImage: z.string().optional(),
        challenge: z.string().min(1).max(1000),
        process: z.string().min(1).max(1000),
        solution: z.string().min(1).max(1000),
        results: z.array(z.object({
            metric: z.string().max(50),
            value: z.string().max(50)
        })).max(5)
    })).max(5).optional().default([]),
    tools: z.array(z.string()).max(20).optional().default([]),
    docsUrl: z.string().url().optional().or(z.literal(''))
});

export const MinimalistCVSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    name: z.string().min(1, 'Name is required').max(100),
    role: z.string().min(1, 'Role is required').max(100),
    headline: z.string().min(1, 'Headline is required').max(200),
    email: z.string().email('Valid email is required'),

    // Optional fields
    featuredProject: z.object({
        title: z.string().max(100),
        link: z.string().url(),
        image: z.string().optional(),
        desc: z.string().max(200)
    }).optional(),
    skills: z.array(z.object({
        name: z.string().max(50),
        proficiency: z.number().min(0).max(100)
    })).max(10).optional().default([]),
    experience: z.array(z.object({
        company: z.string().max(100),
        role: z.string().max(100),
        dates: z.string().max(50),
        bullets: z.array(z.string()).max(5)
    })).max(10).optional().default([]),
    education: z.array(z.object({
        school: z.string().max(100),
        degree: z.string().max(100),
        year: z.string().max(10)
    })).max(5).optional().default([]),
    resumeUrl: z.string().url().optional().or(z.literal(''))
});

export const MotionReelSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    email: z.string().email('Valid email is required'),

    // Optional fields
    heroReel: z.object({
        url: z.string().url().optional(),
        poster: z.string().optional()
    }).optional(),
    projects: z.array(z.object({
        title: z.string().max(100),
        thumbnail: z.string().optional(),
        videoUrl: z.string().url().optional(),
        duration: z.string().max(10)
    })).max(12).optional().default([]),
    bts: z.array(z.object({
        caption: z.string().max(200),
        media: z.string().optional()
    })).max(6).optional().default([])
});

export const InteractiveDemoSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    githubUrl: z.string().url('GitHub URL is required'),

    // Optional fields
    heroDemo: z.object({
        url: z.string().url().optional(),
        title: z.string().max(100)
    }).optional(),
    demos: z.array(z.object({
        title: z.string().max(100),
        embedUrl: z.string().url().optional(),
        tech: z.array(z.string()).max(10)
    })).max(10).optional().default([]),
    snippets: z.array(z.object({
        language: z.string().max(50),
        code: z.string().max(2000)
    })).max(10).optional().default([])
});

export const NarrativeScrollSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    epilogue: z.object({
        text: z.string().min(1, 'Epilogue text is required').max(500),
        ctaText: z.string().min(1).max(100),
        ctaLink: z.string().url().or(z.literal(''))
    }),

    // Optional fields
    chapters: z.array(z.object({
        title: z.string().max(50),
        body: z.string().max(1000),
        bgImage: z.string().optional()
    })).max(10).optional().default([]),
    artifacts: z.array(z.object({
        title: z.string().max(100),
        link: z.string().url()
    })).max(10).optional().default([])
});

// ============================================================================
// PRODUCT THEMES
// ============================================================================

export const LaunchPadSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    productName: z.string().min(1, 'Product name is required').max(100),
    tagline: z.string().min(1, 'Tagline is required').max(200),

    // Optional fields
    heroVideo: z.string().optional(),
    problem: z.string().max(1000).optional(),
    solution: z.string().max(1000).optional(),
    waitlistCta: z.string().max(50).optional().default('Join the Waitlist'),
    testimonials: z.array(z.object({
        quote: z.string().max(500),
        name: z.string().max(100),
        role: z.string().max(100)
    })).max(5).optional().default([]),
    faq: z.array(z.object({
        q: z.string().max(200),
        a: z.string().max(500)
    })).max(10).optional().default([])
});

export const FeatureFocusSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    productName: z.string().min(1, 'Product name is required').max(100),
    tagline: z.string().min(1, 'Tagline is required').max(200),

    // Optional fields
    features: z.array(z.object({
        title: z.string().max(100),
        desc: z.string().max(200),
        icon: z.string().optional(),
        image: z.string().optional()
    })).max(5).optional().default([]),
    comparison: z.object({
        enabled: z.boolean().default(false),
        rows: z.array(z.object({
            feature: z.string().max(100),
            self: z.string().max(50),
            competitor: z.string().max(50)
        })).max(10)
    }).optional(),
    ctaPrimary: z.string().max(50).optional().default('Start Free Trial'),
    ctaSecondary: z.string().max(50).optional().default('View Pricing')
});

export const DigitalDownloadSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    productName: z.string().min(1, 'Product name is required').max(100),
    price: z.string().min(1, 'Price is required').max(50),

    // Optional fields
    previewItems: z.array(z.string()).max(10).optional().default([]),
    included: z.array(z.string()).max(20).optional().default([]),
    testimonials: z.array(z.object({
        text: z.string().max(500),
        name: z.string().max(100)
    })).max(5).optional().default([]),
    buyLink: z.string().url().optional().or(z.literal(''))
});

export const HardwareShowcaseSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    productName: z.string().min(1, 'Product name is required').max(100),
    price: z.string().min(1, 'Price is required').max(50),

    // Optional fields
    gallery: z.array(z.string()).max(10).optional().default([]),
    specs: z.array(z.object({
        key: z.string().max(50),
        value: z.string().max(100)
    })).max(20).optional().default([]),
    variants: z.array(z.object({
        name: z.string().max(50),
        inStock: z.boolean().default(true)
    })).max(10).optional().default([]),
    shippingNote: z.string().max(200).optional()
});

export const OpenSourceSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    projectName: z.string().min(1, 'Project name is required').max(100),
    tagline: z.string().min(1, 'Tagline is required').max(200),
    githubUrl: z.string().url('GitHub URL is required'),

    // Optional fields
    stats: z.array(z.object({
        label: z.string().max(50),
        value: z.string().max(20),
        icon: z.string().max(50)
    })).max(5).optional().default([]),
    quickStart: z.string().max(200).optional(),
    features: z.array(z.object({
        title: z.string().max(100),
        desc: z.string().max(200)
    })).max(10).optional().default([]),
    contributors: z.array(z.string()).max(20).optional().default([]),
    docsUrl: z.string().url().optional().or(z.literal(''))
});

export const NicheToolSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    toolName: z.string().min(1, 'Tool name is required').max(100),
    tagline: z.string().min(1, 'Tagline is required').max(200),

    // Optional fields
    demoEmbed: z.string().optional(),
    problem: z.string().max(500).optional(),
    solution: z.string().max(500).optional(),
    useCases: z.array(z.string()).max(10).optional().default([]),
    pricing: z.object({
        free: z.string().max(100),
        pro: z.string().max(100)
    }).optional(),
    ctaLink: z.string().url().optional().or(z.literal(''))
});

// ============================================================================
// BUSINESS THEMES
// ============================================================================

export const LocalBizSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    businessName: z.string().min(1, 'Business name is required').max(100),
    address: z.string().min(1, 'Address is required').max(200),
    phone: z.string().min(1, 'Phone is required').max(50),

    // Optional fields
    tagline: z.string().max(200).optional(),
    email: z.string().email().optional(),
    hours: z.array(z.object({
        day: z.string().max(50),
        time: z.string().max(50)
    })).max(7).optional().default([]),
    reviews: z.array(z.object({
        text: z.string().max(500),
        name: z.string().max(100),
        rating: z.number().min(1).max(5)
    })).max(10).optional().default([]),
    gallery: z.array(z.string()).max(10).optional().default([])
});

export const ServiceCoSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    companyName: z.string().min(1, 'Company name is required').max(100),
    tagline: z.string().min(1, 'Tagline is required').max(200),

    // Optional fields
    services: z.array(z.object({
        title: z.string().max(100),
        desc: z.string().max(200)
    })).max(10).optional().default([]),
    results: z.array(z.object({
        metric: z.string().max(50),
        value: z.string().max(50)
    })).max(5).optional().default([]),
    clients: z.array(z.string()).max(20).optional().default([]),
    ctaLink: z.string().url().optional().or(z.literal(''))
});

export const EcoBrandSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    brandName: z.string().min(1, 'Brand name is required').max(100),
    mission: z.string().min(1, 'Mission is required').max(500),

    // Optional fields
    impact: z.array(z.object({
        metric: z.string().max(50),
        value: z.string().max(50)
    })).max(5).optional().default([]),
    values: z.array(z.object({
        title: z.string().max(100),
        desc: z.string().max(200)
    })).max(10).optional().default([]),
    ctaLink: z.string().url().optional().or(z.literal(''))
});

export const EventSpaceSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    venueName: z.string().min(1, 'Venue name is required').max(100),
    capacity: z.string().min(1, 'Capacity is required').max(50),

    // Optional fields
    tagline: z.string().max(200).optional(),
    amenities: z.array(z.string()).max(20).optional().default([]),
    gallery: z.array(z.string()).max(10).optional().default([]),
    pricing: z.string().max(200).optional(),
    bookingLink: z.string().url().optional().or(z.literal(''))
});

export const FranchiseHubSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    brandName: z.string().min(1, 'Brand name is required').max(100),
    tagline: z.string().min(1, 'Tagline is required').max(200),

    // Optional fields
    locations: z.array(z.object({
        city: z.string().max(100),
        address: z.string().max(200),
        phone: z.string().max(50)
    })).max(20).optional().default([]),
    aboutBrand: z.string().max(1000).optional(),
    franchiseLink: z.string().url().optional().or(z.literal(''))
});

export const LegacyCoSchema = z.object({
    config_version: z.literal('v1'),
    // Required hero fields
    companyName: z.string().min(1, 'Company name is required').max(100),
    founded: z.string().min(1, 'Founded year is required').max(10),
    tagline: z.string().min(1, 'Tagline is required').max(200),

    // Optional fields
    timeline: z.array(z.object({
        year: z.string().max(10),
        event: z.string().max(200)
    })).max(20).optional().default([]),
    values: z.array(z.object({
        title: z.string().max(100),
        desc: z.string().max(200)
    })).max(10).optional().default([]),
    awards: z.array(z.string()).max(10).optional().default([])
});

// ============================================================================
// Export theme schemas map
// ============================================================================

export const THEME_SCHEMAS = {
    // Freelancers
    quickpitch: QuickPitchSchema,
    skillstack: SkillStackSchema,
    hiremenow: HireMeNowSchema,
    storybuilder: StoryBuilderSchema,
    localpro: LocalProSchema,
    sidehustle: SideHustleSchema,

    // Portfolios
    gallerygrid: GalleryGridSchema,
    casestudy: CaseStudySchema,
    minimalistcv: MinimalistCVSchema,
    motionreel: MotionReelSchema,
    interactivedemo: InteractiveDemoSchema,
    narrativescroll: NarrativeScrollSchema,

    // Products
    launchpad: LaunchPadSchema,
    featurefocus: FeatureFocusSchema,
    digitaldownload: DigitalDownloadSchema,
    hardwareshowcase: HardwareShowcaseSchema,
    opensource: OpenSourceSchema,
    nichetool: NicheToolSchema,

    // Businesses
    localbiz: LocalBizSchema,
    serviceco: ServiceCoSchema,
    ecobrand: EcoBrandSchema,
    eventspace: EventSpaceSchema,
    franchisehub: FranchiseHubSchema,
    legacyco: LegacyCoSchema
};

export const validateThemeData = (themeId, data) => {
    const schema = THEME_SCHEMAS[themeId];
    if (!schema) {
        throw new Error(`Unknown theme: ${themeId}`);
    }
    return schema.parse(data);
};
