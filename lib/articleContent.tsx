import Link from 'next/link';

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
  'priekslaicigas-vs-standarta-pensija': (
    <>
      <p>
        Latvijā standarta vecuma pensija pienākas no 65 gadu vecuma, ja ir vismaz 20 gadu apdrošināšanas
        stāžs. Personām ar vismaz 30 gadu stāžu ir vēl viena iespēja: pensionēties līdz 2 gadiem agrāk,
        63 vai 64 gadu vecumā.
      </p>
      <p>
        Priekšlaicīgā pensija vienmēr ir mazāka par to, ko tā pati persona saņemtu, nogaidot līdz 65
        gadiem, un šī atšķirība ir pastāvīga: tā turpinās visu atlikušo mūžu, nevis izlīdzinās vēlāk. Divu
        iemeslu dēļ. Pirmkārt, agrāk pensionējoties, uzkrātajā kapitālā ir mazāk iemaksu, jo darba mūžs ir
        īsāks. Otrkārt, koeficients G jaunākā vecumā ir lielāks (jo paredzamais izmaksas periods ir garāks),
        tāpēc tas pats kapitāls, dalīts ar lielāku skaitli, dod mazāku mēneša summu.
      </p>
      <p>
        Kas tad var padarīt priekšlaicīgu pensionēšanos saprātīgu izvēli, ja summa ir zemāka? Galvenokārt
        situācijas, kad turpmāka strādāšana pati par sevi vairs nav vēlama vai iespējama (veselības stāvoklis,
        darba tirgus situācija konkrētajā profesijā vai vecuma grupā), un divu gadu agrāka pensijas izmaksa
        atsver zemāko mēneša summu. Tīri finansiālā ziņā, ja veselība un darba iespējas to atļauj, nogaidīšana
        līdz standarta vecumam (vai pat vēlāk, jo katrs papildu gads to vēl palielina) dod lielāku mēneša
        pensiju.
      </p>
    </>
  ),
  'pensija-latvija-celvedis': (
    <>
      <p>
        Latvijas pensiju sistēmai ir trīs līmeņi. 1. līmenis ir obligāts un valsts pārvaldīts, 2. līmenis ir
        obligāts, bet ieguldīts tavā izvēlētajā fondā, un 3. līmenis ir pilnībā brīvprātīgs papildu
        uzkrājums. Turpmāk katram no tiem ir sava sadaļa ar saiti uz attiecīgo kalkulatoru vai skaidrojumu.
      </p>

      <h2 className="font-sans text-h2">1. līmenis</h2>
      <p>
        Obligātā, valsts pārvaldītā pensijas daļa, kas balstīta uz apdrošināšanas stāžu un algu, no kuras
        veiktas iemaksas.{' '}
        <Link
          href="/finanses/pensijas-kalkulators"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Aprēķini savu paredzamo 1. līmeņa pensiju
        </Link>
        , vai uzzini par{' '}
        <Link
          href="/finanses/minimala-pensija"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          minimālās pensijas garantiju
        </Link>
        , ja aprēķinātā summa sanāk maza.
      </p>

      <h2 className="font-sans text-h2">Priekšlaicīga pensionēšanās</h2>
      <p>
        Ar vismaz 30 gadu apdrošināšanas stāžu ir iespējams pensionēties līdz 2 gadiem agrāk par standarta
        65 gadu vecumu, taču par zemāku mēneša summu.{' '}
        <Link
          href="/finanses/priekslaicigas-pensijas-kalkulators"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Aprēķini priekšlaicīgo pensiju
        </Link>{' '}
        vai izlasi{' '}
        <Link
          href="/finanses/priekslaicigas-vs-standarta-pensija"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          salīdzinājumu ar standarta pensionēšanos
        </Link>
        .
      </p>

      <h2 className="font-sans text-h2">2. līmenis</h2>
      <p>
        Obligātā daļa, kas tiek ieguldīta tavā izvēlētajā pensiju fondā. Šai sadaļai plānots kalkulators,
        taču tas vēl nav publicēts, jo fondu vidējā ienesīguma dati pēc riska kategorijām vēl nav pieejami
        sagatavošanai nepieciešamajā formā.
      </p>

      <h2 className="font-sans text-h2">3. līmenis</h2>
      <p>
        Pilnībā brīvprātīgs papildu uzkrājums ar iedzīvotāju ienākuma nodokļa atmaksu par iemaksām.{' '}
        <Link
          href="/finanses/pensiju-3-limena-kalkulators"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Aprēķini savu 3. līmeņa uzkrājumu un nodokļa atmaksu
        </Link>
        .
      </p>

      <h2 className="font-sans text-h2">Ilgtermiņa uzkrājumi un ieguldīšana pensijai</h2>
      <p>
        Papildus obligātajiem un brīvprātīgajiem pensiju līmeņiem daudzi veido arī savu, neatkarīgu
        ilgtermiņa uzkrājumu vērtspapīros.{' '}
        <Link
          href="/finanses/ieguldijumu-konta-nodoklu-kalkulators"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Uzzini, cik izdevīgs ir ieguldījumu konts salīdzinājumā ar parastu kontu
        </Link>{' '}
        nodokļu ziņā ilgtermiņa uzkrājumam.
      </p>

      <h2 className="font-sans text-h2">Citas pensiju shēmas</h2>
      <p>
        Atsevišķām profesijām (aviācija, dzelzceļš, jūrniecība, māksla) un militārpersonām pastāv{' '}
        <Link
          href="/finanses/izdienas-pensija"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          izdienas pensija
        </Link>
        , kas ir pilnībā atsevišķa no 1., 2. un 3. līmeņa.
      </p>
    </>
  ),
  'izdienas-pensija': (
    <>
      <p>
        Izdienas pensija ir atsevišķa pensijas shēma noteiktām profesijām, kur ilgstošs darbs konkrētajā
        amatā vai dienestā ir saistīts ar profesionālo iemaņu zudumu vai paaugstinātu risku. Tā nav daļa no
        1., 2. vai 3. pensiju līmeņa un tai ir savi, atsevišķi likumā noteikti nosacījumi katrai profesiju
        grupai.
      </p>
      <p>
        Likums &quot;Par izdienas pensijām&quot; aptver vairākas profesiju grupas: aviācijas darbiniekus
        (piloti, apkalpe, gaisa satiksmes dispečeri, tehniskais personāls), dzelzceļa darbiniekus
        (stacijas dežuranti un dispečeri lielas satiksmes intensitātes līnijās, lokomotīvju vadītāji,
        ceļu uzturēšanas darbinieki), jūrniecības un sabiedriskā transporta darbiniekus (zvejas un upju
        flotes jūrnieki, autobusu, trolejbusu un tramvaju vadītāji pilsētās ar vismaz 40 000 iedzīvotāju),
        kā arī mākslas un kultūras jomas darbiniekus (baleta dejotāji, cirka izpildītāji, operas un baleta
        teātra solisti, leļļu teātra aktieri).
      </p>
      <p>
        Militārpersonām ir sava, atsevišķa izdienas pensijas shēma, ko regulē Militārpersonu izdienas
        pensiju likums, nevis likums &quot;Par izdienas pensijām&quot;.
      </p>
      <p>
        Nepieciešamais stāžs atšķiras pēc profesijas, piemēram, aviācijas pilotiem tas ir 25 gadi vīriešiem
        un 20 gadi sievietēm, dzelzceļa darbiniekiem 25 gadi vīriešiem un 20 gadi sievietēm (ar daļu no tā
        nostrādātu tieši attiecīgajā amatā), baleta dejotājiem vismaz 20 gadi radošā darba stāža. Pensijas
        apmēru aprēķina pēc likuma &quot;Par valsts pensijām&quot; vispārējās kārtības, nevis pēc atsevišķas
        izdienas pensijas formulas.
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
  'izdienas-pensija': (
    <p className="text-sm text-panel-faint">
      Likums{' '}
      <a
        href="https://m.likumi.lv/ta/id/65827-par-izdienas-pensijam"
        className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
      >
        &quot;Par izdienas pensijām&quot;
      </a>
      , izgūts 2026. gada 11. septembrī.
    </p>
  ),
};
