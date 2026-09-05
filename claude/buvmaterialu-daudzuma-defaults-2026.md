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

