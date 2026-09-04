import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privātuma politika',
  description: 'Kā Manikalkulatori.lv apstrādā datus.',
  alternates: { canonical: '/privatuma-politika' },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="font-mono text-2xl font-semibold">Privātuma politika</h1>
      <p className="text-panel-muted">
        Šī privātuma politika apraksta, kādus datus Manikalkulatori.lv apstrādā un kā tie tiek izmantoti.
      </p>
      <h2 className="font-mono text-xl">Mitināšana</h2>
      <p className="text-panel-muted">
        Vietne darbojas uz Vercel infrastruktūras. Vercel apstrādā standarta servera žurnālus (IP
        adresi, pieprasījuma laiku, pārlūkprogrammas veidu) drošības un darbības nodrošināšanai.
      </p>
      <h2 className="font-mono text-xl">Analītika</h2>
      <p className="text-panel-muted">
        Apmeklējumu statistikai izmantojam Vercel Web Analytics, kas neizmanto sīkdatnes un neuzkrāj
        personu identificējošu informāciju, tikai apkopotus, anonimizētus datus par lapu apmeklējumiem.
      </p>
      <p className="text-panel-muted">
        Ar tavu piekrišanu izmantojam arī Google Analytics, lai saprastu, kuras lapas ir noderīgas un no
        kurienes nāk apmeklētāji. Google Analytics uzstāda sīkdatnes (piemēram, <code>_ga</code> un{' '}
        <code>_ga_*</code>) un nosūta datus (IP adresi, ierīces un pārlūkprogrammas veidu, apmeklētās
        lapas, aptuvenu atrašanās vietu) uz Google serveriem apstrādei. Šie dati tiek glabāti līdz 14
        mēnešiem un netiek izmantoti tavai personiskai identificēšanai. Google Analytics tiek ielādēts
        tikai pēc tavas piekrišanas sīkdatņu paziņojumā. Vairāk par Google datu apstrādi vari lasīt{' '}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-panel-border underline-offset-4 hover:decoration-current"
        >
          Google privātuma politikā
        </a>
        .
      </p>
      <h2 className="font-mono text-xl">Sīkdatnes</h2>
      <p className="text-panel-muted">
        Kad pirmo reizi apmeklē vietni, parādās sīkdatņu paziņojums ar iespēju pieņemt vai noraidīt
        analītikas sīkdatnes. Ja noraidi, Google Analytics netiek ielādēts un sīkdatnes netiek uzstādītas
        — vietne darbojas tāpat abos gadījumos. Savu izvēli jebkurā brīdī vari mainīt, izmantojot saiti
        &quot;Sīkdatņu iestatījumi&quot; lapas apakšā. Ja nākotnē tiks pievienotas reklāmas, piemēram,
        Google AdSense, šī politika tiks atjaunināta.
      </p>
      <h2 className="font-mono text-xl">Kalkulatoru dati</h2>
      <p className="text-panel-muted">
        Kalkulatoros ievadītie skaitļi tiek apstrādāti tikai tavā pārlūkprogrammā un netiek nosūtīti vai
        saglabāti serverī.
      </p>
      <h2 className="font-mono text-xl">Kontakti</h2>
      <p className="text-panel-muted">
        Jautājumus par datu apstrādi vari sūtīt uz kontaktu lapā norādīto e-pastu.
      </p>
      <p className="text-caption text-panel-faint">Šī politika pēdējo reizi atjaunināta 2026. gada septembrī.</p>
    </main>
  );
}
