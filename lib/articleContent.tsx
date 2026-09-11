/**
 * Body + sources copy per article slug, hand written JSX exactly like `explanations`/
 * `sourcesContent` in `app/[category]/[calculator]/page.tsx` for calculators — no
 * markdown parsing dependency, same convention as the rest of the site. Every article
 * added to `lib/registry.ts`'s `articles` array must also get a `body` entry here.
 */
export const articleBody: Record<string, React.ReactNode> = {};

/** Optional "Avoti" section per article slug — omit an entry for an article with no
 * cited external source (should be rare; articles exist specifically to state sourced
 * facts). */
export const articleSources: Record<string, React.ReactNode> = {};
