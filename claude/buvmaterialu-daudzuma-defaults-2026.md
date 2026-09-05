# Būvmateriālu daudzuma kalkulatori — pētījuma un lēmumu žurnāls (2026-09-05)

Kopīgs izpētes žurnāls desmit jaunajiem Mājoklis un enerģija kategorijas kalkulatoriem. Katram kalkulatoram sava sadaļa. Kanoniskais dati dzīvo `lib/registry.ts` un attiecīgajos `lib/calculators/*.ts` failos; šis dokuments ir konteksts un lēmumu vēsture, ne dublējošs datu avots.

Konvencija, kas noteikta pirms 1. kalkulatora: Mājoklis kategorijas kalkulatori izmanto vispārīgo `CalculatorShell` maršrutu (nevis atsevišķu bespoke page.tsx), bez atsevišķa datu faila vai avotu sadaļas šodien. Tā kā šai sērijai nepieciešama tāda pati stingrā avotu disciplīna kā Sabiedrība un Finanses kalkulatoriem, `CalculatorShell` paplašināts ar diviem jauniem, izvēles React mezgliem, `limitations` un `sources`, kas renderējas tikai tad, ja padoti (esošie 4 kalkulatori tos nesaņem un renderējas tieši tāpat kā līdz šim).

## 1. Jumta seguma daudzuma kalkulators

Slug: `jumta-seguma-daudzums`. Formula: jumta_platība = pamatnes_platība ÷ cos(slīpuma_leņķis).

Sourced primitīvi:
- Garākā formula, [omnicalculator.com](https://www.omnicalculator.com/construction/roofing), izgūts 2026-09-05.
- Betona un keramikas dakstiņi, 8,9 līdz 12,8 gab/m², [Benders montāžas instrukcija](https://orberg.lv/wp-content/uploads/2025/07/Benders-betona-dakstini-montazas-instrukcija-2025-ORBERG.pdf), izgūts 2026-09-05. PDF ir attēls, ne teksts, WebFetch un pdftoppm abi neizdevās izgūt lasāmu saturu, tāpēc precīza tabula pa slīpuma pakāpēm nav pieejama šajā gājienā, izmantots avotā jau zināmais kopējais diapazons ar viduspunktu (10,5) kā noklusējumu.
- Metāla T20 profila loksnes, efektīvais platums 1,1 m, maksimālais garums 12 m, [Ruukki](https://www.ruukki.com/lva/jumti/jumta-materiali/jumta-loksnes/jumta-loksnes-produkti/trapetsprofiil-t20-24w-1100), izgūts 2026-09-05.
- Bitumena šindeļi, 2 līdz 3,1 m² uz iepakojumu, [kursi.lv](https://www.kursi.lv/lv/buvmateriali/jumta-segumi-un-jumta-piederumi/bitumena-sindeli). Kategorijas lapa bloķēja WebFetch (403), spot pārbaudīts ar konkrētu produktu, IKO Superglass 3TAB, 2 m² iepakojums, atrasts caur meklēšanu, [tiešā produkta lapa](https://www.kursi.lv/lv/bitumena-sindeli-iko-superglass-3tab-52-dual-black-iepakojums-2-m2), apstiprina diapazona apakšējo robežu.
- Rezerves procents, 10 līdz 15 procenti, [roofr.com](https://roofr.com/blog/how-to-calculate-roof-waste-factor). Nav stingra avota konkrētam skaitlim, tāpēc kalkulatorā tas ir pielāgojams lauks ar redzamu atrunu, nevis citēts fakts.
- Kores un citu piederumu daudzums, nav atrasts vispārīgs noteikums, apzināti atstāts ārpus MVP, iezīmēts kā nākamais solis FAQ un limitācijās, nevis izgudrota konstante.

Piezīme: pamanīta un labota reāla peldošā punkta problēma calculateJumtaSeguma iekšienē (skaidrs, apaļš ievades skaitlis, piemēram, 100 m² × 1,1 rezerve × 10 gab/m², dažkārt matemātiski precīzi deva veselu skaitu, bet peldošā punkta troksnis to pabīdīja tikko pāri robežai, un Math.ceil noapaļoja par vienu vienību par daudz). Labots ar nelielu epsilona korekciju pirms Math.ceil (ceilWhole palīgfunkcija), pietiekami maza, lai neietekmētu īstus, ne veselus rezultātus, bet novērš šo konkrēto artefaktu.

Reģistrēts CalculatorShell paplašinājums (limitations un sources mezgli), sk. iepriekš šī dokumenta sākumā.

## 2. Tapetes daudzuma kalkulators

Slug: `tapetes-daudzums`. Formula: ruļļa_platība = ruļļa_platums × ruļļa_garums; nepieciešamie ruļļi = ceil((sienu_platība × (1 + rezerve)) ÷ ruļļa_platība).

Sourced primitīvi:
- Ruļļa izmērs 0,53 reiz 10 metri, Latvijas mazumtirdzniecības konvencija, apstiprināts vairākos LV veikalos (tapetenshop.lv skaidri raksta "standarta izmēra tapešu rullis", depo.lv un kursi.lv produktu saraksti). ES tehniskā specifikācija bieži uzrāda 10,05 m, atšķirība atzīmēta kā limitācija un FAQ, nevis klusi ignorēta.
- Rezerves procents bez raksta, 10 līdz 15 procenti, [deborainteriors.com](https://deborainteriors.com/tools/wallpaper-calculator/), izgūts 2026-09-05.
- Rezerves procenti pēc raksta atkārtojuma veida, [renocalchub.com](https://renocalchub.com/blog/interior/wallpaper-pattern-repeat.html): neliels raksts (0 līdz 6 collas) +10%, liels taisns raksts (7 līdz 18 collas) +15%, nobīdes raksts (19 līdz 25 collas) +25%. Avots dod konkrētus skaitļus katrai kategorijai, ne diapazonu kā uzdevumā pieņemts, izmantoti avotā tieši dotie skaitļi.

Raksta veida izvēle UI ir ērtuma funkcija, ne aprēķina parametrs: izvēloties raksta veidu, rezerves procenta lauks automātiski piedāvā avotā norādītu vērtību, bet paliek tieši pielāgojams, tāpat kā citur šajā kalkulatoru saimē. (Piezīme: pirmajā versijā UI teksts kļūdaini saturēja angļu vārdu "sourced" Latviešu tekstā, atklāts un labots 3. kalkulatora izstrādes gaitā.)

## 3. Ķieģeļu un bloku daudzuma kalkulators

Slug: `kiegelu-bloku-daudzums`. Formula: efektīvā_vienības_platība = ((garums + šuve) ÷ 1000) × ((augstums + šuve) ÷ 1000); nepieciešamās vienības = ceil((sienas_platība × (1 + rezerve)) ÷ efektīvā_vienības_platība). Vienības biezums (sienas biezuma virziens) apzināti nav ievades parametrs, jo tas neietekmē vienību skaitu uz vienu m² sienas sejas.

Sourced primitīvi:
- Keramiskais ķieģelis, 250 reiz 120 reiz 65 mm, [Lode](https://lode.lv/produkts/pilnais-apdares-kiegelis-sahara-250x120x65/). Uzdevumā dotā URL (ar "-2" sufiksu) atgrieza 404, WebFetch uz šo tīro URL izdevās, un dimensija papildus apstiprināta caur meklēšanu vairākos citos Lode produktu ierakstos (Andromeda, Gemini, Vecais Brunis, Janka) un trešo pušu tirgotājiem (buvniecibas-abc.lv, ventum.lv, prof.lv, buveletak.lv).
- Gāzbetona bloks, 600 reiz 300 reiz 200 mm, [Bauroc](https://bauroc.lv/eku-projektesana/tehniskie-dati/), izgūts tieši ar WebFetch, izgūts 2026-09-05. 300 mm platums ir CLASSIC 300 sērijas tipiskais biezums, sērijai kopumā diapazons ir 99 līdz 500 mm, aprēķinam izmantoti tikai garums un augstums.
- Šuves biezums, 10 līdz 14 mm, konverģējošs vairāku avotu diapazons. FIBO vadlīnijas ([fibo.lv](https://www.fibo.lv/fibo-bloku-iestrades-vadlinijas)) bloķēja WebFetch (403 kļūda), diapazons apstiprināts caur [Wienerberger Baltic](https://www.wienerberger.ee/lv/produkcija/keramiskie-un-klinkera-kiegeli-terca/padomi-un-instrukcijas/pamatnoteikumi-un-rekomendacijas-murdarbiem.html) un citiem avotiem, izgūts 2026-09-05. Noklusējuma vērtība ir diapazona apakšējā robeža (10 mm).
- Rezerves procents, nav atrasts stingrs avots konkrētam skaitlim mūrniecībai, tāpēc pielāgojams lauks (noklusējums 5%), nevis citēts fakts.
- Plānšuves (līmes) sistēmas gāzbetona blokiem ar 1 līdz 3 mm šuvi apzināti atstātas ārpus MVP, tas ir cits mūrēšanas paņēmiens ar būtiski atšķirīgu materiālu patēriņu, atzīmēts limitācijās un FAQ.

Reāla kļūda, ko atklāja mans pašrakstītais robežgadījuma tests pirms commit: sākotnējā nulles aizsardzība pārbaudīja atvasināto `effectiveUnitAreaM2 > 0`, nevis izejas dimensijas. Ja vienības garums un augstums abi ir 0, bet šuves biezums nav 0, atvasinātā platība tomēr ir nenulle (piemēram, 10 mm šuve viena pati dod 0,0001 m²), tāpēc aizsardzība neaktivizējās un kods dalīja sienas platību ar šo mākslīgi mazo skaitli, iegūstot absurdi lielu vienību skaitu (100 000 vietā 10 m² sienai ar 0 mm vienību). Labots, pārbaudot izejas dimensijas tieši (`unitLengthMm > 0 && unitHeightMm > 0`), nevis atvasināto platību.

## 4. Javas un apmetuma daudzuma kalkulators

Slug: `javas-apmetuma-daudzums`. Šis kalkulators satur divus režīmus ar patiešām atšķirīgām formulām, ne vienu formulu ar materiāla izvēli kā 1. un 3. kalkulatorā.

Pirms rakstīšanas veikta izpēte par to, vai mūrjavu (javu starp ķieģeļiem/blokiem) un apmetumu (virsmas apdares kārtu) var rēķināt ar vienu un to pašu pieeju. Secinājums, ko apstiprināja lietotājs pirms koda rakstīšanas:

- **Apmetums**: tīri sourced. Trīs neatkarīgi produkti (Baumit MPI 25, Baumit RatioGlatt, Stimelit ST 5.03) dod konverģējošu patēriņa likmi 1,1 līdz 1,6 kg uz m² uz mm biezuma, katrs ar savu produkta lapu. Formula: daudzums_kg = platība × biezums_mm × likme, maisi = ceil(daudzums_kg ÷ maisa_svars).
- **Mūrjava**: ražotāju dotais patēriņš uz kubikmetru mūra (138 līdz 200 kg/m³, [keraterm.lv](https://keraterm.lv/akcijas-noteikumi/), [bmvide.lv](http://www.bmvide.lv/?l=1&c=761&p=184)) atšķiras gandrīz uz pusi atkarībā no vienības tipa un tukšumiem, tas nav pietiekami precīzs formulai. Tā vietā javas apjoms aprēķināts ģeometriski: sienas apjoms mīnus vienību kopējais apjoms, izmantojot to pašu vienību skaita formulu, kas jau ir `kiegelu-bloku-daudzums` (kods faktiski importē un atkārtoti izmanto `calculateKiegeluBlokuDaudzums`, ne tikai atsauci uz to). Šī sienas apjoms mīnus vienību apjoms metode ir vispārpieņemta mūrniecības aprēķina metode, apstiprināta, piemēram, [engineeringcivil.com](https://www.engineeringcivil.com/mortar-calculation-in-brickwork.html) un [quantity-takeoff.com](https://www.quantity-takeoff.com/calculation-of-the-quantities-cement-sand-&-wate-in-mortar-for-any-brickwork.html). Iegūtais litru apjoms pārvērsts kilogramos ar viena konkrēta produkta (Sakret ZM, 25 kg maiss dod aptuveni 15 L) ražotāja iznākumu, nevis ar neprecīzu vidējo.
- Šī pieeja pieprasīja vienības platumu (sienas biezuma virzienu) kā jaunu ievadi, ko `kiegelu-bloku-daudzums` formula apzināti neizmantoja (tur tas neietekmē vienību skaitu uz m²). Lai izvairītos no dublēšanās, `kiegelu-bloku-daudzums-defaults.ts` `UNIT_DEFAULTS` papildināts ar `widthMm` lauku katrai vienībai (atpakaļsaderīga papildināšana, neietekmē 3. kalkulatoru).

Rezerves procents abos režīmos nav sourced, pielāgojams lauks.

Cross-link: mūrjavas režīms tekstā norāda uz `kiegelu-bloku-daudzums` kalkulatoru kā avotu vienību skaitam, ja lietotājs to jau ir aprēķinājis, bet nepieprasa to, jebkurš var ievadīt izmērus tieši šeit.

Kļūda, ko atklāja lietotāja neatkarīga pārbaude pēc pirmās versijas apstiprināšanas: pirmajā versijā `calculateJavasDaudzums` savu `wastePercent` parametru nodeva tieši `calculateKiegeluBlokuDaudzums` izsaukumam, kas nozīmē, ka pie jebkuras rezerves vērtības, kas nav 0%, gan sienas apjoms, gan no tā atvasinātais vienību skaits tika vienādi uzpumpēti pirms atņemšanas, nevis tikai gala rezultāts. Tā kā abi termini tika uzpumpēti proporcionāli, praktiskā ietekme uz aprēķinu bija tuvu pareizajai (rezultāts vienkārši mērogojās ar (1+rezerve) reizinātāju), bet konceptuāli tas sajauca divus dažādus "rezerves" jēdzienus, mūrniecības pirkšanas rezervi (lūzumi, apgriešana) ar javas zudumu rezervi (šļakatas, sajaukšanas zudumi). Labots, aprēķinot vienību skaitu un sienas apjomu vienmēr ar rezervi 0% (fiziski patiesais, uzbūvētajā sienā esošais daudzums), un piemērojot šī kalkulatora paša rezerves procentu tikai reizi, tieši iegūtajam javas apjomam. Jauns tests (`javas-apmetuma-daudzums.test.ts`) tagad tieši pārbauda, ka rezerves procents maina tikai gala javas apjomu, nevis ģeometrijā izmantoto vienību skaitu.

## 5. Ģipškartona lokšņu daudzuma kalkulators

Slug: `gipskartona-loksnu-daudzums`. Formula: loksnes_platība = platums × garums; nepieciešamās loksnes = ceil((platība × (1 + rezerve)) ÷ loksnes_platība). Vienkāršākais no visiem desmit kalkulatoriem, viena formula, viens sourced izmērs, bez atsevišķa materiāla veida izvēles kā 1., 3. un 4. kalkulatoram.

Sourced primitīvi:
- Loksnes izmērs 1200 reiz 2600 mm, apstiprināts vairākos neatkarīgos LV mazumtirgotājos un vairākos loksnu veidos (standarta, mitrumizturīgais, ugunsdrošais), [ksenukai.lv](https://www.ksenukai.lv/p/gipskartona-plaksne-knauf-2600-mm-x-1200-mm-x-12-5-mm/esux), [buvniecibas-abc.lv](https://buvniecibas-abc.lv/lv/veikals/buvmateriali/gipskartons-un-gipskartona-profili/standarta-gipskartons/knauf-gkb-125x1200x2600mm-standarta-gipskartons-60loksnespalete), [wolmarveikals.lv](https://wolmarveikals.lv/product/knauf-red-gkf-ugunsdrosa-plaksne-1200x2600-12-5mm/), izgūts 2026-09-05. 2000 un 3000 mm garumi arī tiek tirgoti, iekļauti kā papildu izvēles pogas.
- Biezums (9,5 vai 12,5 mm) apstiprināts kā reāli tirgoti varianti, bet apzināti nav aprēķina ievade, jo neietekmē platību, tikai svaru un klasi.
- Rezerves procents, 5 līdz 20 procenti, [homeadvisor.com](https://www.homeadvisor.com/r/drywall-calculator). Nav atrasts Latvijai specifisks avots, tikai starptautiska žāvējamā kartona kalkulatoru konvencija, tāpēc pielāgojams lauks ar redzamu atrunu.
- Loksnu orientācija (horizontāli vai vertikāli) apzināti atstāta ārpus modeļa, tā ietekmē šuvju skaitu un montāžas darbu, bet ne kopējo nepieciešamo platību.

## 6. Grants, smilts un šķembu apjoma kalkulators

Slug: `grants-smilts-skembu-apjoms`. Formula: apjoms_m3 = platība × biezums_m; apjoms_ar_rezervi = apjoms_m3 × (1 + sablīvēšanās_rezerve); masa_t = apjoms_ar_rezervi × blīvums.

Pirms rakstīšanas veikta izpēte, lai pārbaudītu, vai smiltij, grantij un šķembām ir sourced blīvuma skaitlis Latvijas tirgū. Pirmais izpētes gājiens secināja, ka neviens no trim materiāliem nav tieši sourced no Latvijas piegādātāja lapas. **Tas bija nepareizi lietotāja neatkarīgas pārbaudes rezultātā**: lietotājs pats atrada un pārbaudīja [dgr.lv/karjera-materialu-tirdznieciba/](https://dgr.lv/karjera-materialu-tirdznieciba/), Latvijas karjera materiālu tirgotāja lapu, kas tieši norāda "Dabīga smilts ar filtrācijas koeficentu 1,6 līdz 2,2 m/dnn, blīvums 1,5 līdz 1,56 g/cm3". Šis tika neatkarīgi apstiprināts ar tiešu WebFetch pirms izmaiņu veikšanas. Tātad smiltij IR reāls Latvijas avots, grantij un šķembām nav (šķembām ir tikai foruma diskusija, ne ražotāja lapa).

Sourced/aplēstie primitīvi (koriģēts pēc lietotāja pārbaudes):
- **Smilts blīvums, 1,5 līdz 1,56 t/m³, sourced tieši no [dgr.lv](https://dgr.lv/karjera-materialu-tirdznieciba/) (Latvijas karjera materiālu tirgotājs), noklusējums 1,53 t/m³ (diapazona viduspunkts).** Rādīts UI kā citēts fakts ar atsauci, ne kā aplēse, atšķirībā no grants un šķembām.
- Grants blīvums, nav atrasts neviens avots ar konkrētu skaitli, tikai aplēse (1,4 līdz 1,7 t/m³), atzīmēts kā vismazāk pamatotais no trim.
- Šķembu blīvums, atkarīgs no frakcijas: šķirotai frakcijai apmēram 1,35 līdz 1,45 t/m³, jauktai granulometrijai 1,65 līdz 1,75 t/m³, [building.lv](https://www.building.lv) praktiķu foruma diskusija, ne ražotāja datu lapa.
- Sablīvēšanās rezerve, 10 līdz 20 procenti, nav atrasts Latvijai specifisks vai oficiāls avots, tikai starptautiska aplēse (krievu GOST/SNiP avoti, kas nav uzskatāmi par Latvijas avotu), tāpēc pielāgojams lauks ar redzamu atrunu.

UI un limitāciju teksts diferencē smilti (sourced, ar atsauci) no grants un šķembām (aplēse, ar redzamu atrunu), nevis pieskaita visus trīs vienādi kā sākotnējā versijā.

## 7. Terases dēļu daudzuma kalkulators

Slug: `terases-delu-daudzums`. Formula: viena_dēļa_segums = garums × (platums + šuve) ÷ 1000000; nepieciešamie dēļi = ceil((platība × (1 + rezerve)) ÷ viena_dēļa_segums). Tā pati "pieskaita šuvi platumam" loģika kā ķieģeļu/bloku un tapetes kalkulatoros, atkārtoti pielietota jaunam materiālam.

Sourced primitīvi:
- Kompozīta (WPC) dēļa izmērs 150 reiz 2900 mm, konverģē no trim neatkarīgiem produktiem (148, 149, 150 mm platums, 24 līdz 25 mm biezums), [buvniecibas-abc.lv](https://buvniecibas-abc.lv/en/shop/lumber/composite-materials-wpc/wpc-terrace-board-25x150x2900mm-gray-composite-material), [terasei.lv](https://terasei.lv/en/product/wpc-decking-board-art-2-149mm-x-24mm/), [topdex.lv](https://topdex.lv/lv/produkti/terases-deli/), izgūts 2026-09-05.
- Koka dēļa platums 145 mm, sourced no reāla lapegles produkta, [patatimber.lv](https://patatimber.lv/p/86-terases-delis-lapegle-28-x-145-kd18-c-dt50), izgūts 2026-09-05. Garums 4000 mm ir aplēse tipiskajā 2400 līdz 4800 mm diapazonā, jo produkta lapa bloķēja pilnu piekļuvi, atklāti atzīmēts limitācijās kā aplēse, ne sourced.
- Šuves platums pēc materiāla, sausam kokam 4 līdz 6 mm, mitram impregnētam kokam sākotnēji 2 līdz 3 mm (paplašinās žūstot), kompozītam 4 līdz 5 mm, [gridasguru.lv](https://gridasguru.lv/ka-ieklat-terases-delus-biezakas-kludas-un-ka-no-tam-izvairities), korespondē ar reālu instrumentu (Eurotec 4/5/6/8 mm starplikas), [ottensten.lv](https://ottensten.lv/products/eurotec-delu-starplika-4-8-mm). Noklusējums 5 mm ietilpst visos diapazonos.
- Rezerves procents, 10 līdz 20 procenti, starptautiska terases kalkulatoru konvencija, nav Latvijai specifiska avota.
- Atstarpe no mājas sienas vai citiem fiksētiem objektiem apzināti atstāta ārpus modeļa, tā ir cita, parasti platāka atstarpe, kas neietekmē dēļu skaitu.

## 8. Laminātā un vinila grīdas seguma kalkulators

Slug: `laminata-vinila-daudzums`. Formula: platība_ar_rezervi = platība × (1 + rezerve); nepieciešami_iepakojumi = ceil(platība_ar_rezervi ÷ iepakojuma_segums). Vienkāršākā formula šajā partijā līdzās ģipškartonam, bez papildu ģeometrijas, jo iepakojuma segums jau ir gatavs m² skaitlis, ne atvasināts no atsevišķām dēlīša dimensijām.

Sourced primitīvi:
- Laminātā iepakojuma segums, EGGER (ražotājs) pats publicē precīzus skaitļus savā instalācijas rokasgrāmatā: 1,39 m² (EL2033), 1,99 m² (visbiežākais, 8 dēlīši), 2,54 m² (EDF186), [egger.com](https://www.egger.com/en/blog/how-much-laminate-flooring-do-i-need), izgūts 2026-09-05. Noklusējums 1,99 m², visbiežāk sastopamais.
- Vinila (SPC) iepakojuma segums 2,208 m², apstiprināts trīs ETERNA SPC 6x181x1220mm, 33. klase produkta krāsu variantiem, [kursi.lv](https://www.kursi.lv/lv/vinila-grida-eterna-spc-6x181x1220-mm-33-klase-sebastian-oak-05325-m2), izgūts 2026-09-05 (tiešais WebFetch bloķēts 403, apstiprināts caur meklēšanas rezultātu fragmentiem trim atsevišķiem produkta variantiem).
- Rezerves procents, EGGER instalācijas vadlīnijas: 10% standarta gadījumā, līdz 15% nepieredzējušiem uzstādītājiem, tas ir ražotāja avots, ne tikai vispārīga konvencija. Sekundārs, mazāk uzticams avots min līdz 30% rakstainam izkārtojumam, atzīmēts limitācijās, bet nav izmantots kā primārais skaitlis.
- Pamatne zem grīdas seguma apzināti atstāta ārpus modeļa, arī EGGER pats to rēķina atsevišķi no seguma iepakojuma.

## 9. Pašizlīdzinošās javas daudzuma kalkulators

Slug: `pasizlidzinosas-javas-daudzums`. Formula ir identiska 4. kalkulatora apmetuma režīmam (platība × biezums × likme, tad dala ar maisa svaru), tāpēc kods tieši importē un atkārtoti izmanto `calculateApmetumaDaudzums` no `javas-apmetuma-daudzums.ts`, nevis pārraksta to pašu formulu no jauna.

Šī bija tā kalkulatora batch daļa, kur pirms rakstīšanas jau bija zināms, ka sourcing būs tīrs (divi oficiāli Henkel/Ceresit TDS skaitļi), un izpēte to apstiprināja, bez pārsteigumiem:

Sourced primitīvi (visi trīs tieši no Henkel/Ceresit oficiālajām tehnisko datu lapām, PDF izlasīts tieši, ne meklēšanas fragmenti):
- Ceresit CN 69 Nivel Extra (plāna finiša java), 1 līdz 15 mm, patēriņš 1,5 kg/m²/mm, maiss 25 kg, [henkel-dam.com (LT TDS)](https://dm.henkel-dam.com/is/content/henkel/lt-ceresit-cn69-savaime-issilyginantis-misinys-1-15mm-25kg-tds-lt), izgūts 2026-09-05.
- Ceresit CN 76 Extrahart (bieza izlīdzinošā java), 4 līdz 50 mm, patēriņš 2,0 kg/m²/mm, maiss 25 kg, [henkel-dam.com (LV TDS)](https://dm.henkel-dam.com/is/content/henkel/tds-lv-ceresit-cn76-pasizlidzinosa-java-25kg), izgūts 2026-09-05.
- (Trešais pārbaudītais produkts, Ceresit CN 75 Fiber Plan, 1,5 kg/m²/mm, netika iekļauts UI kā atsevišķa izvēle, jo tā patēriņš sakrīt ar CN69 un neienes jaunu informāciju, bet apstiprina, ka 1,5 kg/m²/mm nav nejaušība vienam produktam.)
- Rezerves procents, 5 līdz 10 procenti, nav atrasts nevienā no trim pārbaudītajām datu lapām, tāpēc atklāti atzīmēts kā vispārīga būvniecības konvencija, ne šī materiāla ražotāja fakts.

Divu javu izvēle (plāna pret biezu) atbilst reālam produktu sadalījumam, ne mākslīgi izgudrotai izvēlei, katrai ir savs biezuma diapazons un patēriņa likme.



