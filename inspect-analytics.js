
const fs = require('fs');

function getEnv() {
    try {
        const content = fs.readFileSync('.env.local', 'utf8');
        const lines = content.split('\n');
        const env = {};
        lines.forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                env[parts[0].trim()] = parts.slice(1).join('=').trim();
            }
        });
        return env;
    } catch (e) {
        return {};
    }
}

const env = getEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function inspectAnalyticsSchema() {
    const headers = {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
    };

    try {
        const resp = await fetch(`${supabaseUrl}/rest/v1/`, { headers });
        const schema = await resp.json();

        const analytics = schema.definitions?.page_analytics;
        console.log('--- PAGE_ANALYTICS ---');
        console.log('Required:', analytics?.required?.join(', '));
        console.log('Properties:');
        Object.keys(analytics?.properties || {}).forEach(k => console.log('  - ' + k));

    } catch (e) {
        console.error('Error:', e.message);
    }
}

inspectAnalyticsSchema();
