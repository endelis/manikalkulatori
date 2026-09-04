# "Mana pensija" kalkulators — Latvijas 1. līmeņa pensijas noklusējuma vērtības (verificēts 2026-09-04, koriģēts 2026-09-04 pēc Checkpoint 1 un Checkpoint 1 papildu labojumiem)

Atsauces vērtības topošajam personiskās pensijas kalkulatoram (Manikalkulatori / kalkulators.lv). Fokuss uz 1. līmeni (valsts obligātā PAYG/NDC shēma), ar 2. un 3. līmeni kā papildu, vienkāršotiem blokiem. Šis dokuments 2026-09-04 pilnībā pārverificēts pret primārajiem avotiem (VSAA, LV portāls, CSP, Satversmes tiesa, manapensija.lv). Atjaunināt periodiski — koeficients G un iemaksu likmes mainās ik gadu.

Statuss: izstrāde sākta (feat/pension-calculator). Checkpoint 1 (datu fails + lapas skelets) pabeigts 2026-09-04, komits b3f8d9a, tostarp labojums K aprēķina dubultās indeksācijas kļūdai (sk. zemāk). Checkpoint 2 (ievades UI un dzīvais aprēķins) pabeigts 2026-09-04, komits fe58583. Kanoniskais datu avots tagad ir repo fails claude/data/lv-pension-vsaa-2026.json, nevis šis dokuments, šis dokuments paliek kā izpētes un lēmumu žurnāls un pirmavotu saraksts.

## Formula (1. līmenis)

Latvijas vecuma pensija ir NDC (notional defined contribution) tipa aprēķins:

**P (mēnesī) = (Ks + K) ÷ G ÷ 12**

- **K** — uzkrātais pensijas kapitāls no 1996. gada. Reālas iemaksas (kur zināma faktiskā tā gada alga) tiktu reizinātas ar attiecīgā gada apdrošināšanas iemaksu algas indeksu, lai kapitāls nezaudētu vērtību laikā. Šajā kalkulatorā gadiem bez pilnas algu vēstures izmantota atpakaļejoša aizpilde ar pašreizējo algu, BEZ papildu indeksācijas, sk. "K aprēķina vienkāršojums" zemāk, kur izskaidrots, kāpēc.
- **Ks** — sākuma kapitāls par darba stāžu līdz 1995. gada beigām. MVP lēmums (2026-09-04): Ks netiek aprēķināts, stāžs pirms 1996. gada ir ārpus darbības jomas — sk. limitācijas zemāk.
- **G** — koeficients, kas atspoguļo paredzamo pensijas izmaksas periodu (gados) izvēlētajā pensionēšanās vecumā. To ik gadu publicē VSAA, balstoties uz CSP paredzamā mūža ilguma datiem. Jo vēlāk pensionējas, jo mazāks G, jo lielāka mēneša pensija par to pašu kapitālu.
- Personām ar 30+ gadu stāžu (t.sk. 5+ pēc 1996. g.), bet zemu vidējo algu, aprēķinā var izmantot valsts vidējo algu — garantē minimālu līmeni. Nav modelēts MVP.

## Parametri (verificēts 2026-09-04)

| # | Parametrs | Vērtība | Avots / statuss |
|---|---|---|---|
| 1 | Pensionēšanās vecums | 65 gadi, MVP slīdnis 65 līdz 70 (atlikšana, nevis priekšlaicīga pensija) | Spēkā no 2025. g., nav plānotu turpmāku izmaiņu. Apstiprināts: [LV portāls, publicēts 2026-04-10](https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026). Augsta pārliecība. |
| 2 | Minimālais apdrošināšanas stāžs | 20 gadi | Spēkā no 2025. g. Tas pats avots apstiprina, publicēts 2026-04-10. Augsta pārliecība. |
| 3 | VSAOI kopējā likme | 34,09% (23,59% darba devējs + 10,50% darbinieks) | Apstiprināts 2026. gadam: [gramatvedisriga.lv CORVUS pārskats](https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026), [VSAA](https://www.vsaa.gov.lv/en/contributions-0). Griesti €105 300/gadā (nemainīgi no 2025). Augsta pārliecība. |
| 4 | Pensiju apdrošināšanas daļa | 20% no bruto algas kopā, sadalījums: 15% 1. līmenim, 5% 2. līmenim (iepriekš dokumentā bija 14%/6%, tas vairs nav pareizi 2026. gadam) | No 2025. g. 1 procentpunkts pārdalīts no 2. uz 1. līmeni (Saeima, 2024-12-04 grozījumi Valsts fondēto pensiju likumā). Satversmes tiesa 2026-06-18 apstiprinājusi, ka šis samazinājums atbilst Satversmei, [LSM raksts](https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/). Pasniegts kā pagaidu, apmēram 4 gadu pasākums no 2025. g.; precīzs atgriešanās gads pie 14%/6% avotos nav skaidri norādīts, jāatzīmē kalkulatorā kā pagaidu vērtība. Augsta pārliecība par pašreizējo 15/5 sadalījumu; zema pārliecība par to, kad tas mainīsies atpakaļ. |
| 5 | Koeficients G (65 g. vecumā) | 17,76 (spēkā no 2026-01-01) | Primārais avots, pilna tabula (40. līdz 90. g.): [VSAA, "Vecuma pensijas aprēķināšanai piemērojamie plānotie vecuma pensijas izmaksas laika periodi G no 2026. gada 1. janvāra"](https://www.vsaa.gov.lv/lv/media/5322/download). Augsta pārliecība, retrieved 2026-09-04. Pilna tabula pievienota zemāk, un tagad arī claude/data/lv-pension-vsaa-2026.json repo. |
| 6 | Apdrošināšanas algas indekss (K indeksācijai) | Pilna gadu pa gadam virkne 1997 līdz 2024 tagad claude/data/lv-pension-vsaa-2026.json repo. Šajā kalkulatorā gadiem bez pilnas algu vēstures šis indekss netiek piemērots atpakaļejoši aizpildītajiem gadiem, sk. "K aprēķina vienkāršojums" zemāk. | Avots: VSAA "Apdrošināšanas iemaksu algas indeksi (2025)", https://www.vsaa.gov.lv/lv/media/7364/download?attachment= . Precīza atrašanās vieta PDF iekšienē: dokuments ir 2 lapas bez iekšējiem lapu numuriem vai sadaļu virsrakstiem; 1. lapā ir 1996 līdz 2013 iemaksu gada rindas, 2. lapā ir 2014 līdz 2023 rindas. Izgūts un lapots ar WebFetch 2026-09-04; ja VSAA pārpublicē šo failu ar citu lapojumu, šis citāts jāpārbauda no jauna. |
| 6b | Algu pieauguma pieņēmums nākotnes projekcijām | Nesenā fakta bāze: CSP apstiprina, ka 2025. g. vidējā bruto alga (€1815/mēn.) pieauga 7,7% gadā ([CSP, publicēts 2026-03-03](https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro)); banku konsensuss 2026. gadam apmēram 7% (Swedbank/SEB/Luminor, [apollo.lv, 2025-12-30](https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7)). MVP lēmums (2026-09-04): noklusējums konservatīvs (apmēram 3,5% nominālā gadā), nesenie faktiskie un prognozētie skaitļi rādīti tikai kā atsauces punkts, nevis noklusējums. Lietotājam dota iespēja pielāgot. |  |
| 7 | 2. līmeņa pieņemtā ienesīgums (ja iekļauj) | Ārpus MVP darbības jomas (lēmums 2026-09-04), sk. atklātos datus zemāk atsaucei, ja tiek veidots nākamais bloks. | [manapensija.lv, Aktuālie dati](https://www.manapensija.lv/lv/pensiju-2-limenis/aktualie-dati/), dati uz 2026-06-30. |
| 8 | 3. līmeņa iemaksu limits (IIN atvieglojumam) | Ārpus MVP darbības jomas (lēmums 2026-09-04), dati verificēti un saglabāti atsaucei zemāk, ja tiek veidots nākamais bloks. 10% no gada bruto ienākumiem, maksimums €4000/gadā. Atmaksājamā IIN likme vairumam nodokļu maksātāju: 25,5%. Šis limits ir neatkarīgs no vispārējā €600/ģimenes loceklim attaisnoto izdevumu griestiem. | [lvportals.lv](https://lvportals.lv/skaidrojumi/373233-attaisnotie-izdevumi-par-kuriem-var-atgut-iedzivotaju-ienakuma-nodokla-parmaksu-2025), [plz.lv](https://www.plz.lv/attaisnotie-izdevumi-par-iemaksam-pensiju-fondos-un-apdrosinasanas-premijam/), [Citadele](https://www.citadele.lv/lv/useful/self-service/savings/savings/3pl/benefits-faq/). |

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

## MVP darbības joma (fiksēts 2026-09-04)

- Ievade: dzimšanas gads, pašreizējā bruto alga, esošais apdrošināšanas stāžs (tikai no 1996. g.), algas pieauguma pieņēmums (noklusējums apmēram 3,5%), pensionēšanās vecums (slīdnis 65 līdz 70).
- Ks (pirms 1996. gada stāžs) izslēgts pilnībā no MVP, redzama, konkrēta atruna lietotājiem ar iespējamu pirms 1996. gada stāžu.
- 2. un 3. līmenis izslēgti no šīs sesijas, skaidri iezīmēti kā nākamais solis lapas saturā, nevis klusēti izlaisti.
- K aprēķins gadiem bez pilnas algu vēstures: atpakaļejoša aizpilde ar pašreizējo algu, BEZ papildu indeksācijas (sk. zemāk, kāpēc), vienkāršojums, jāatrunā metodoloģijas sadaļā skaidri.

## K aprēķina vienkāršojums (koriģēts 2026-09-04)

Sākotnējā Checkpoint 1 versija atpakaļejoši aizpildīja katru stāža gadu ar pašreizējo algu UN pēc tam reizināja to ar reālo VSAA gada indeksu virkni no tā gada līdz šim gadam. Tas bija kļūda: pašreizējā alga jau ir izteikta šodienas naudas vērtībā, tāpēc papildu indeksācija to palielinātu vēlreiz, dubultā ieskaitot algu pieaugumu.

Labojums (2026-09-04): atpakaļejoši aizpildītajiem gadiem indekss vairs netiek piemērots. Katra stāža gada iemaksa aprēķināta vienkārši kā pašreizējā gada bruto alga reizināta ar 1. līmeņa likmi, bez indeksācijas reizinātāja. Reālā VSAA indeksu virkne paliek repo (claude/data/lv-pension-vsaa-2026.json) kā citējami dati un ir pieejama funkcijai `cumulativeIndex` metodoloģijas satura vajadzībām (piemēram, lai parādītu, kāds būtu bijis rezultāts ar reālu vēsturisku algu datiem), taču tā vairs nepiedalās K aprēķinā pašā kalkulatorā.

Rezultāta piemērs (10 gadu stāžs, €1815 mēnesī, pensionēšanās 2055. gadā 65 gadu vecumā):

- Pirms labojuma: capitalPast = 47 713,45 EUR, capitalTotal = 207 505,03 EUR, mēneša pensija apmēram 973,65 EUR.
- Pēc labojuma: capitalPast = 32 670,00 EUR, capitalTotal = 192 461,58 EUR, mēneša pensija apmēram 903,07 EUR.

Vienību pārbaudes tests (`lib/calculators/pensijas-kalkulators.test.ts`) tagad tieši fiksē šo uzvedību: rezultāts ir identisks neatkarīgi no tā, vai indeksu virkne ir aizpildīta vai tukša, kas pierāda, ka tā vairs neietekmē K.

## Zināmie vienkāršojumi / limitācijas (jāatrunā kalkulatora lapā, tāpat kā dzimstības kalkulatoram)

- Neietver pirms 1996. gada stāžu (izslēgts no MVP, sk. iepriekš), redzama atruna nepieciešama.
- Neietver minimālās pensijas garantijas mehānismu (30+ gadu stāžs ar zemu algu, valsts vidējā alga), pieminēt kā ierobežojumu.
- G vērtība nākotnes gadiem (kad lietotājs faktiski pensionēsies) nav zināma iepriekš, jāizmanto pašreizējā G (2026. gada tabula) kā tuvinājums, skaidri jānorāda, ka reālā vērtība mainīsies (vēsturiski svārstījusies, arī kritusies Covid laikā).
- Neietver IIN, kas tiek ieturēts no pensijas, kalkulators rāda pensiju pirms šī IIN, tas jāatrunā skaidri.
- 2. līmeņa 15/5 sadalījums ir pagaidu (kopš 2025), nevis pastāvīgs, kalkulatoram jāatzīmē šis fakts.
- Vispārējā vecuma pensija pieejama tikai no 65 g. vecuma; priekšlaicīga pensionēšanās nav modelēta MVP (slīdnis ierobežots uz 65 līdz 70).
- K aprēķina vienkāršojums (atpakaļejoša aizpilde ar pašreizējo algu, bez indeksācijas): pieņem, ka lietotājs visus stāža gadus pelnījis šodienas nominālo algu, kas nav ekonomiski precīzi (reālā alga pagātnē bijusi zemāka). Metodoloģijas sadaļā jāizskaidro precīzi, sk. "K aprēķina vienkāršojums" iepriekš.

## Avoti (verificēti 2026-09-04)

- [VSAA: koeficienta G tabula no 2026-01-01](https://www.vsaa.gov.lv/lv/media/5322/download)
- [VSAA: apdrošināšanas iemaksu algas indeksi (2025)](https://www.vsaa.gov.lv/lv/media/7364/download?attachment=), pilna virkne 1997 līdz 2024 tagad claude/data/lv-pension-vsaa-2026.json repo, precīza lapu atrašanās vieta norādīta 6. rindā iepriekš
- [VSAA: On contributions (VSAOI likmes, EN)](https://www.vsaa.gov.lv/en/contributions-0)
- [CORVUS/gramatvedisriga.lv: VSAOI likmes 2026](https://gramatvedisriga.lv/lv/blog/vsaoi-rates-2026)
- [LSM: Saeima apstiprina 1% pārdali no 2. uz 1. līmeni (2024-12-04)](https://www.lsm.lv/raksts/zinas/ekonomika/04.12.2024-1-no-pensiju-otra-limena-iemaksam-parnesis-uz-pirmo-limeni.a578779/)
- [LSM: Satversmes tiesa apstiprina samazinājuma atbilstību Satversmei (2026-06-18)](https://www.lsm.lv/raksts/zinas/ekonomika/18.06.2026-tiesa-pensiju-2-limena-iemaksu-likmes-termineta-samazinasana-par-vienu-procentpunktu-atbilst-satversmei.a651990/)
- [LV portāls: Pensijas vecums ir 65 gadi (2026-04-10)](https://lvportals.lv/e-konsultacijas/38466-pensijas-vecums-ir-65-gadi-iesniegumu-var-iesniegt-vienu-menesi-pirms-dosanas-pensija-2026)
- [LV portāls: attaisnotie izdevumi pārskats](https://lvportals.lv/skaidrojumi/373233-attaisnotie-izdevumi-par-kuriem-var-atgut-iedzivotaju-ienakuma-nodokla-parmaksu-2025)
- [plz.lv: attaisnotie izdevumi par pensiju fondiem/apdrošināšanas prēmijām](https://www.plz.lv/attaisnotie-izdevumi-par-iemaksam-pensiju-fondos-un-apdrosinasanas-premijam/)
- [Citadele: 3. līmeņa nodokļu atvieglojumu FAQ](https://www.citadele.lv/lv/useful/self-service/savings/savings/3pl/benefits-faq/)
- [CSP: vidējais atalgojums 2025, €1815, +7,7% (2026-03-03)](https://www.csp.gov.lv/lv/jaunums/2025-gada-videjais-atalgojums-pirms-nodoklu-nomaksas-1-815-eiro)
- [apollo.lv: banku prognoze algu kāpumam 2026 apmēram 7% (2025-12-30)](https://www.apollo.lv/8387615/banku-analitiki-2026-gada-latvija-gaida-darba-samaksas-kapumu-par-videji-apmeram-7)
- [manapensija.lv: 2. līmeņa aktuālie dati (ienesīgums pa plāniem, dati uz 2026-06-30)](https://www.manapensija.lv/lv/pensiju-2-limenis/aktualie-dati/)
- [Santa.lv: Kā aprēķina pensiju 1. līmeni? (vispārējs skaidrojums, nav pārbaudīts datumā)](https://www.santa.lv/raksts/klubs/ka-aprekina-pensiju-1.-limeni-75654/)

## Atklātie jautājumi

1. Kā rīkoties ar pirms 1996. gada stāžu MVP posmā, atrisināts 2026-09-04: izslēgts no MVP.
2. Algas pieauguma noklusējums, atrisināts 2026-09-04: konservatīvs (apmēram 3,5%).
3. Pensionēšanās vecuma slīdnis, atrisināts 2026-09-04: 65 līdz 70, bez priekšlaicīgas pensijas.
4. 2. un 3. līmenis šajā sesijā, atrisināts 2026-09-04: nav, tikai 1. līmenis.
5. Precīza VSAA algas indeksu PDF lapa vai sadaļa citātam, atrisināts 2026-09-04: dokuments ir 2 lapas bez iekšējiem numuriem, 1. lapa satur 1996 līdz 2013 rindas, 2. lapa satur 2014 līdz 2023 rindas, sk. 6. rindu iepriekš.
6. Vai K aprēķina atpakaļejošā aizpilde ar pašreizējo algu un reālo indeksāciju rada dubultu indeksāciju, atrisināts 2026-09-04: jā, radīja, labots, sk. "K aprēķina vienkāršojums" iepriekš.
