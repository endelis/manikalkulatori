# "Mana pensija" kalkulators — Latvijas 1. līmeņa pensijas noklusējuma vērtības (verificēts 2026-09-04)

Atsauces vērtības topošajam personiskās pensijas kalkulatoram (Manikalkulatori / kalkulators.lv). Fokuss uz 1. līmeni (valsts obligātā PAYG/NDC shēma), ar 2. un 3. līmeni kā papildu, vienkāršotiem blokiem. Šis dokuments 2026-09-04 pilnībā pārverificēts pret primārajiem avotiem (VSAA, LV portāls, CSP, Satversmes tiesa, manapensija.lv). Atjaunināt periodiski — koeficients G un iemaksu likmes mainās ik gadu.

## Formula (1. līmenis)

Latvijas vecuma pensija ir NDC (notional defined contribution) tipa aprēķins:

**P (mēnesī) = (Ks + K) ÷ G ÷ 12**

- **K** — uzkrātais un indeksētais pensijas kapitāls no 1996. gada. Katru gadu veiktās iemaksas (no 2025. gada **15%** no bruto algas 1. līmenim, sk. zemāk — nevis 14%, kā iepriekš dokumentā) tiek reizinātas ar attiecīgā gada apdrošināšanas iemaksu algas indeksu, lai kapitāls nezaudētu vērtību laikā.
- **Ks** — sākuma kapitāls par darba stāžu līdz 1995. gada beigām (ja tāds ir): Ks = Vi × As × 0,2 × 12, kur Vi ir vidējā indeksētā apdrošināšanas alga 1996.–1999. g. (48 mēnešu references periods), As — stāža gadi līdz 1995. g.
- **G** — koeficients, kas atspoguļo paredzamo pensijas izmaksas periodu (gados) izvēlētajā pensionēšanās vecumā. To ik gadu publicē VSAA, balstoties uz CSP paredzamā mūža ilguma datiem. Jo vēlāk pensionējas, jo mazāks G, jo lielāka mēneša pensija par to pašu kapitālu.
- Personām ar 30+ gadu stāžu (t.sk. 5+ pēc 1996. g.), bet zemu vidējo algu, aprēķinā var izmantot valsts vidējo algu — garantē minimālu līmeni.

## Parametri (verificēts 2026-09-04)

| # | Parametrs | Vērtība | Avots / statuss |
|---|---|---|---|
| 1 | Pensionēšanās vecums | **65 gadi** | Spēkā no 2025. g., nav plānotu turpmāku izmaiņu. Apstiprināts: [LV portāls, publicēts 2026-04-10](https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026). Augsta pārliecība. |
| 2 | Minimālais apdrošināšanas stāžs | **20 gadi** | Spēkā no 2025. g. Tas pats avots apstiprina, publicēts 2026-04-10. Augsta pārliecība. |
| 3 | VSAOI kopējā likme | **34,09%** (23,59% darba devējs + 10,50% darbinieks) | Apstiprināts 2026. gadam: [gramatvedisriga.lv CORVUS pārskats](https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026), [VSAA](https://www.vsaa.gov.lv/en/contributions-0). Griesti €105 300/gadā (nemainīgi no 2025). Augsta pārliecība. |
| 4 | Pensiju apdrošināšanas daļa | **20% no bruto algas kopā, bet sadalījums MAINĪJIES: 15% → 1. līmenim, 5% → 2. līmenim** (iepriekš dokumentā bija 14%/6% — TAS VAIRS NAV PAREIZI 2026. gadam) | No 2025. g. 1 procentpunkts pārdalīts no 2. uz 1. līmeni (Saeima, 2024-12-04 grozījumi Valsts fondēto pensiju likumā). Satversmes tiesa 2026-06-18 apstiprinājusi, ka šis samazinājums atbilst Satversmei — [LSM raksts](https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/). Pasniegts kā **pagaidu, ~4 gadu pasākums** no 2025. g.; precīzs atgriešanās gads pie 14%/6% avotos nav skaidri norādīts — **jāatzīmē kalkulatorā kā pagaidu vērtība, nevis pieņemt, ka tā ir pastāvīga**. Augsta pārliecība par pašreizējo 15/5 sadalījumu; zema pārliecība par to, kad tas mainīsies atpakaļ. |
| 5 | Koeficients G (65 g. vecumā) | **17,76** (spēkā no 2026-01-01) | Primārais avots — pilna tabula (40.–90. g.): [VSAA, "Vecuma pensijas aprēķināšanai piemērojamie plānotie vecuma pensijas izmaksas laika periodi G no 2026. gada 1. janvāra"](https://www.vsaa.gov.lv/lv/media/5322/download). Balstīts uz CSP paredzamā mūža ilguma datiem. Augsta pārliecība, retrieved 2026-09-04. Pilna tabula pievienota zemāk. |
| 6 | Apdrošināšanas algas indekss (K indeksācijai) | Jaunākā VSAA publicētā viena gada indeksa vērtība: **1,1041 (2023. g. iemaksām)**. Jaunāku (2024./2025. g.) indeksu VSAA vēl nav publicējusi — parasti ir 1-2 gadu nobīde. | [VSAA "Apdrošināšanas iemaksu algas indeksi (2025)"](https://www.vsaa.gov.lv/lv/media/7364/download?attachment=). Vidēja pārliecība par pilnīgumu (jaunākie gadi vienkārši vēl nav aprēķināti, ne tāpēc, ka vērtība būtu 0 vai 1). |
| 6b | Algu pieauguma pieņēmums nākotnes projekcijām | Nesenā fakta bāze: CSP apstiprina, ka 2025. g. vidējā bruto alga (€1815/mēn.) pieauga **7,7%** gadā ([CSP, publicēts 2026-03-03](https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro)); banku konsensuss 2026. gadam ~**7%** (Swedbank/SEB/Luminor, [apollo.lv, 2025-12-30](https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7)). **Ieteikums:** NEIZMANTOT 7% kā noklusējumu ilgtermiņa (30+ gadu) projekcijai — tā ir īstermiņa "panākšanas" izaugsme pēckovida darbaspēka deficīta apstākļos, nav ilgtspējīga. Ieteicams konservatīvāks noklusējums (piem., 3–4% nominālā gadā), ar nesenajiem faktiskajiem/prognozētajiem skaitļiem parādītiem kā atsauces punktu, nevis kā noklusējumu. Lietotājam jādod iespēja pielāgot. |
| 7 | 2. līmeņa pieņemtā ienesīgums (ja iekļauj) | **Nav viena "oficiāla" skaitļa — bet ir citējami, regulāri atjaunināti reālie dati pa plāna riska tipu.** manapensija.lv publicē faktisko ienesīgumu (dati uz 2026-06-30): aktīvie augsta riska plāni (100% akcijās) 1 g.: 19,17–25,03%; 3 g. (gadā): 13,86–15,91%; 5 g. (gadā): 6,39–11,25%. Vidēja riska plāni: 1 g. 10,52–13,35%; 3 g. 8,14–10,69%; 5 g. 3,14–5,49%; 10 g. 3,24–5,83%. Konservatīvie plāni: 1 g. 1,73–7,77%; 3 g. 4,09–8,09%; 5 g. −0,90–3,70%; 10 g. 0,20–3,75%. Avots: [manapensija.lv, Aktuālie dati](https://www.manapensija.lv/lv/pensiju-2-limenis/aktualie-dati/). **Ieteikums:** MVP posmā NEPROJICĒT 2. līmeņa uzkrājumu ar vienu ienesīguma skaitli — diapazons ir pārāk plats un 1 gada dati ir sagriezti ar tirgus svārstībām. Ja tomēr iekļauj, rādīt 5 vai 10 gadu vidēja riska plāna diapazonu kā skaidri marķētu vēsturisku datu diapazonu ("nav garantēts"), nevis vienu prognozes ciparu. |
| 8 | 3. līmeņa iemaksu limits (IIN atvieglojumam) | **10% no gada bruto ienākumiem, maksimums €4000/gadā — APSTIPRINĀTS.** Atmaksājamā IIN likme vairumam nodokļu maksātāju: **25,5%** (ienākumiem līdz €105 300/gadā; virs tā 33%, + 3% solidaritātes pārmaksa virs €200k caur gada deklarāciju — reti attiecas uz kalkulatora mērķauditoriju). **Šis limits ir NEATKARĪGS no vispārējā €600/ģimenes loceklim attaisnoto izdevumu griestiem (izglītība/veselība)** — abi darbojas paralēli, viens otru neietekmē. | [lvportals.lv, attaisnotie izdevumi pārskats](https://lvportals.lv/skaidrojumi/373233-attaisnotie-izdevumi-par-kuriem-var-atgut-iedzivotaju-ienakuma-nodokla-parmaksu-2025), [plz.lv apstiprinājums](https://www.plz.lv/attaisnotie-izdevumi-par-iemaksam-pensiju-fondos-un-apdrosinasanas-premijam/), [Citadele FAQ](https://www.citadele.lv/lv/useful/self-service/savings/savings/3pl/benefits-faq/). Augsta pārliecība (2 neatkarīgi avoti). |

## VSAA koeficienta G pilna tabula (spēkā no 2026-01-01)

| Vecums | G | Vecums | G |
|---|---|---|---|
| 40 | 37,87 | 66 | 17,09 |
| 41 | 37,00 | 67 | 16,41 |
| 42 | 36,12 | 68 | 15,74 |
| 43 | 35,24 | 69 | 15,07 |
| 44 | 34,36 | 70 | 14,39 |
| 45 | 33,48 | 71 | 13,78 |
| 46 | 32,64 | 72 | 13,16 |
| 47 | 31,79 | 73 | 12,54 |
| 48 | 30,94 | 74 | 11,92 |
| 49 | 30,09 | 75 | 11,30 |
| 50 | 29,24 | 76 | 10,73 |
| 51 | 28,43 | 77 | 10,15 |
| 52 | 27,63 | 78 | 9,58 |
| 53 | 26,82 | 79 | 9,00 |
| 54 | 26,01 | 80 | 8,42 |
| 55 | 25,20 | 81 | 7,94 |
| 56 | 24,45 | 82 | 7,45 |
| 57 | 23,69 | 83 | 6,97 |
| 58 | 22,93 | 84 | 6,48 |
| 59 | 22,17 | 85 | 6,00 |
| 60 | 21,41 | 86 | 5,61 |
| 61 | 20,68 | 87 | 5,22 |
| 62 | 19,95 | 88 | 4,83 |
| 63 | 19,22 | 89 | 4,44 |
| 64 | 18,49 | 90 | 4,05 |
| 65 | 17,76 | | |

Avots: [VSAA, media/5322/download](https://www.vsaa.gov.lv/lv/media/5322/download), retrieved 2026-09-04.

## Ko kalkulators varētu prasīt no lietotāja (MVP)

- Dzimšanas gads / pašreizējais vecums
- Pašreizējā bruto alga (mēnesī vai gadā)
- Esošais apdrošināšanas stāžs (gados) vai darba sākuma gads
- Pieņēmums par algas pieaugumu līdz pensijai (noklusējums — sk. #6b iepriekš, konservatīvs, nevis 7%, regulējams)
- Plānotais pensionēšanās vecums (noklusējums 65, ar iespēju mainīt un redzēt G/pensijas izmaiņu)
- (Papildu, ja MVP+) 2. līmeņa uzkrātais atlikums un pieņemtā ienesīguma likme; 3. līmeņa iemaksas

## Zināmie vienkāršojumi / limitācijas (jāatrunā kalkulatora lapā, tāpat kā dzimstības kalkulatoram)

- Neietver pirms-1996 stāžu precīzi bez lietotāja ievadītiem datiem par to periodu (Ks aprēķins prasa vidējo algu 1996–1999, ko lietotājs, visticamāk, nezinās — vajadzēs vienkāršotu tuvinājumu vai jāizslēdz no MVP; **lēmums vēl nav pieņemts, sk. jautājumus lietotājam**).
- Neietver minimālās pensijas garantijas mehānismu (30+ gadu stāžs ar zemu algu → valsts vidējā alga) — pieminēt kā ierobežojumu.
- G vērtība nākotnes gadiem (kad lietotājs faktiski pensionēsies) nav zināma iepriekš — jāizmanto pašreizējā G (2026. gada tabula) kā tuvinājums un skaidri jānorāda, ka reālā vērtība mainīsies (vēsturiski svārstījusies, arī kritusies Covid laikā).
- Neietver IIN, kas tiek ieturēts no pensijas (daļēji atbrīvota, sk. 2026. g. ienākumu slieksni) — kalkulators rāda pensiju PIRMS šī IIN, tas jāatrunā skaidri.
- **2. līmeņa 15/5 sadalījums ir pagaidu (kopš 2025), nevis pastāvīgs** — kalkulatoram jāatzīmē šis fakts, nevis klusi jāpieņem, ka sadalījums nemainīsies visu projekcijas periodu.
- Vispārējā vecuma pensija pieejama tikai no 65 g. vecuma; agrāka pensionēšanās (60–63 g.) ir atsevišķa shēma ar savu kārtību un samazinājumu, ko šis kalkulators (MVP) nemodelē — ja UI ļauj izvēlēties vecumu zem 65, tas jāmarķē skaidri kā "priekšlaicīga pensija, cita kārtība, šeit nemodelēta" vai jāierobežo slīdnis uz 65+.

## Avoti (verificēti 2026-09-04)

- [VSAA: koeficienta G tabula no 2026-01-01](https://www.vsaa.gov.lv/lv/media/5322/download)
- [VSAA: apdrošināšanas iemaksu algas indeksi (2025)](https://www.vsaa.gov.lv/lv/media/7364/download?attachment=)
- [VSAA: On contributions (VSAOI likmes, EN)](https://www.vsaa.gov.lv/en/contributions-0)
- [CORVUS/gramatvedisriga.lv: VSAOI likmes 2026](https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026)
- [LSM: Saeima apstiprina 1% pārdali no 2. uz 1. līmeni (2024-12-04)](https://www.lsm.lv/raksts/zinas/ekonomika/04.12.2024-1-no-pensiju-otra-limena-iemaksam-parnesis-uz-pirmo-limeni.a578779/)
- [LSM: Satversmes tiesa apstiprina samazinājuma atbilstību Satversmei (2026-06-18)](https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/)
- [LV portāls: Pensijas vecums ir 65 gadi (2026-04-10)](https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026)
- [LV portāls: attaisnotie izdevumi pārskats](https://lvportals.lv/skaidrojumi/373233-attaisnotie-izdevumi-par-kuriem-var-atgut-iedzivotaju-ienakuma-nodokla-parmaksu-2025)
- [plz.lv: attaisnotie izdevumi par pensiju fondiem/apdrošināšanas prēmijām](https://www.plz.lv/attaisnotie-izdevumi-par-iemaksam-pensiju-fondos-un-apdrosinasanas-premijam/)
- [Citadele: 3. līmeņa nodokļu atvieglojumu FAQ](https://www.citadele.lv/lv/useful/self-service/savings/savings/3pl/benefits-faq/)
- [CSP: vidējais atalgojums 2025 — €1815, +7,7% (2026-03-03)](https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro)
- [apollo.lv: banku prognoze algu kāpumam 2026 ~7% (2025-12-30)](https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7)
- [manapensija.lv: 2. līmeņa aktuālie dati (ienesīgums pa plāniem, dati uz 2026-06-30)](https://www.manapensija.lv/lv/pensiju-2-limenis/aktualie-dati/)
- [Santa.lv: Kā aprēķina pensiju 1. līmeni? (vispārējs skaidrojums, nav pārbaudīts datumā)](https://www.santa.lv/raksts/klubs/ka-aprekina-pensiju-1.-limeni-75654/)

## Atklātie jautājumi lietotājam (vēl nav atbildēti)

1. Kā rīkoties ar pirms-1996 stāžu MVP posmā, ja neprasām 1996–1999 g. algu? (izslēgt / vienkāršots tuvinājums / brīdinājums)
2. Kāds ir noklusējuma algas pieauguma pieņēmums — konservatīvais (3-4%) vai tuvāks nesenajam faktam/prognozei (~7%)?
3. Vai pensionēšanās vecuma slīdnis ļauj izvēlēties < 65 (ar brīdinājumu par citu kārtību), vai fiksēts 65+?
4. Vai šajā Claude Code sesijā iekļaut 2. un/vai 3. līmeņa blokus, vai palikt tikai pie 1. līmeņa MVP (kā sākotnēji plānots session-plan.md)?
