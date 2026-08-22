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
        Apmeklējumu statistikai izmantojam Vercel Web Analytics. Šis rīks neizmanto sīkdatnes un
        neuzkrāj personu identificējošu informāciju, tikai apkopotus, anonimizētus datus par lapu
        apmeklējumiem.
      </p>
      <h2 className="font-mono text-xl">Sīkdatnes</h2>
      <p className="text-panel-muted">
        Šobrīd vietne nelieto izsekošanas vai reklāmas sīkdatnes. Ja nākotnē tiks pievienotas reklāmas,
        piemēram, Google AdSense, šī politika tiks atjaunināta un apmeklētājiem tiks lūgta piekrišana
        pirms sīkdatņu izmantošanas.
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
      <p className="text-sm text-panel-faint">Šī politika pēdējo reizi atjaunināta 2026. gada augustā.</p>
    </main>
  );
}
