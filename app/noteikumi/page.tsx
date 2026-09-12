import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lietošanas noteikumi',
  description: 'Manikalkulatori.lv lietošanas noteikumi.',
  alternates: { canonical: '/noteikumi' },
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="font-sans text-h1">Lietošanas noteikumi</h1>
      <p className="text-panel-muted">Lietojot Manikalkulatori.lv, tu piekrīti šiem noteikumiem.</p>
      <ol className="list-decimal space-y-2 pl-5 text-panel-muted">
        <li>
          Kalkulatoru rezultāti ir orientējoši. Tie balstās uz tavis ievadītajiem datiem un vispārīgām
          formulām, nevis individuālu finanšu vai juridisku konsultāciju.
        </li>
        <li>
          Pirms svarīgu finanšu lēmumu pieņemšanas pārbaudi skaitļus pie attiecīgā pakalpojumu sniedzēja
          vai speciālista.
        </li>
        <li>
          Vietnes saturu drīkst brīvi lasīt un izmantot personīgām vajadzībām. Satura kopēšana citās
          vietnēs bez atsauces nav atļauta.
        </li>
        <li>
          Vietnes uzturētājs neuzņemas atbildību par zaudējumiem, kas radušies, paļaujoties tikai uz
          kalkulatoru rezultātiem.
        </li>
        <li>Noteikumi var tikt laiku pa laikam atjaunināti. Aktuālā versija vienmēr pieejama šajā lapā.</li>
      </ol>
    </main>
  );
}
