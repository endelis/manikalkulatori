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

Raksta veida izvēle UI ir ērtuma funkcija, ne aprēķina parametrs: izvēloties raksta veidu, rezerves procenta lauks automātiski piedāvā sourced vērtību, bet paliek tieši pielāgojams, tāpat kā citur šajā kalkulatoru saimē.

