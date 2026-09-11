/**
 * Body + sources copy per article slug, hand written JSX exactly like `explanations`/
 * `sourcesContent` in `app/[category]/[calculator]/page.tsx` for calculators — no
 * markdown parsing dependency, same convention as the rest of the site. Every article
 * added to `lib/registry.ts`'s `articles` array must also get a `body` entry here.
 */
export const articleBody: Record<string, React.ReactNode> = {
  'minimala-pensija': (
    <>
      <p>
        Ja aprēķinātā vecuma pensija sanāk mazāka par valstī noteikto minimumu, VSAA to paceļ līdz
        minimālajam apmēram. Minimālā vecuma pensija 2026. gadā balstās uz aprēķina bāzi 213 eiro parastā
        gadījumā, bet personām ar invaliditāti kopš bērnības aprēķina bāze ir 255 eiro.
      </p>
      <p>
        Ar vismaz 20 gadu apdrošināšanas stāžu minimālā pensija ir aprēķina bāze, kas reizināta ar
        koeficientu 1,2, tātad 213 × 1,2 = <strong>255,60 eiro</strong> mēnesī. Personām ar invaliditāti kopš
        bērnības tas ir 255 × 1,2 = <strong>306,00 eiro</strong> mēnesī.
      </p>
      <p>
        Par katru nostrādāto gadu virs 20 gadiem minimums palielinās vēl par 2 procentiem no aprēķina bāzes,
        tātad par 4,26 eiro gadā parastā gadījumā un par 5,10 eiro gadā personām ar invaliditāti kopš
        bērnības. Piemēram, ar 25 gadu stāžu minimālā pensija ir 255,60 plus 5 reizes 4,26, kas ir 276,90
        eiro mēnesī.
      </p>
    </>
  ),
};

/** Optional "Avoti" section per article slug — omit an entry for an article with no
 * cited external source (should be rare; articles exist specifically to state sourced
 * facts). */
export const articleSources: Record<string, React.ReactNode> = {
  'minimala-pensija': (
    <p className="text-sm text-panel-faint">
      VSAA,{' '}
      <a
        href="https://www.vsaa.gov.lv/lv/jaunums/no-2026-gada-1-janvara-paaugstinati-pensiju-un-atlidzibu-minimalie-apmeri-un-valsts-sociala-nodrosinajuma-pabalsta-apmeri"
        className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
      >
        &quot;No 2026. gada 1. janvāra paaugstināti pensiju un atlīdzību minimālie apmēri&quot;
      </a>
      , publicēts 2025. gada 12. decembrī, spēkā no 2026. gada 1. janvāra, izgūts 2026. gada 11. septembrī.
    </p>
  ),
};
