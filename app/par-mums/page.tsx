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
        Vietni uztur un saturu raksta viena persona, ne redakcija vai aģentūra. Daļa kalkulatoru
        (elektroauto ekspluatācijas izmaksas, EKII atbalsts, līzings pret kredītu, KASKO apdrošināšana)
        balstās uz personisku pieredzi ar tieši šiem jautājumiem, nevis vispārīgu izpēti no malas. Sporta
        kalkulatori (skriešanas temps, triatlona plānošana, treniņu zonas) tāpat balstās uz reālu
        treniņu praksi, nevis tikai formulu no mācību grāmatas.
      </p>
      <h2 className="font-sans text-h2">Kā top saturs</h2>
      <p className="text-panel-muted">
        Katrs kalkulators, kas rēķina ar Latvijas nodokļu likmi, valsts atbalsta summu vai citu
        oficiālu skaitli, ir balstīts uz tiešu avotu, ne pārstāstu: likumi.lv, VID, VSAA, Valsts
        kase vai attiecīgās nozares regulators. Katrai lapai ir sadaļa &quot;Avoti&quot; ar konkrētu
        saiti un izgūšanas datumu, lai varētu pats pārbaudīt. Kad likme vai summa mainās, kalkulators
        tiek atjaunināts, ne atstāts novecojis.
      </p>
      <p className="text-panel-muted">
        Ja kāda pieņēmuma vai noklusējuma vērtība nav balstīta uz oficiālu avotu (piemēram, tipiska
        rezerve materiālu daudzuma aprēķinam), tas ir tieši pateikts kalkulatora aprakstā vai bieži
        uzdoto jautājumu sadaļā, nevis pasniegts kā precīzs fakts.
      </p>
      <p className="text-panel-muted">
        Ja pamani neprecizitāti vai vēlies ierosināt jaunu kalkulatoru, raksti uz kontaktu lapā norādīto
        adresi.
      </p>
    </main>
  );
}
