export const mode: 'dev' | 'pro' =
    process.env.PLASMO_PUBLIC_MODE === 'dev' ? 'dev' : 'pro';

export const SearchFix = 'search_';
