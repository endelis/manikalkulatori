import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Par mums',
  description: 'Par Manikalkulatori.lv un tā uzturētāju.',
  alternates: { canonical: '/par-mums' },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="font-sans text-h1">Par mums</h1>
      <p className="text-panel-muted">
        Manikalkulatori.lv ir Latvijas kalkulatoru vietne. Šeit atrodami praktiski rīki auto, finanšu,
        mājokļa, veselības un sporta aprēķiniem latviešu valodā.
      </p>
      <p className="text-panel-muted">
        Vietni uztur un saturu raksta viena persona ar reālu pieredzi tēmās, ko kalkulatori aptver.
        Katrs kalkulators balstās uz pašreizējiem Latvijas datiem un tiek regulāri atjaunināts.
      </p>
      <p className="text-panel-muted">
        Ja pamani neprecizitāti vai vēlies ierosināt jaunu kalkulatoru, raksti uz kontaktu lapā norādīto
        adresi.
      </p>
    </main>
  );
}
