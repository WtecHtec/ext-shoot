export const mode: 'dev' | 'pro' =
    process.env.PLASMO_PUBLIC_MODE === 'dev' ? 'dev' : 'pro';

export const isProd = mode === 'pro';
export const SearchFix = 'search_';


export const RecentSaveNumber = 5;

export const RecentlyFix = 'recently_';

export const ExtShootSeverHost = 'http://localhost:5698';
