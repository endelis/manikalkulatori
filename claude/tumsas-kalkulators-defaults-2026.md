# "Tumsas kalkulators" — Rīgas gaismas stundu noklusējuma vērtības (verificēts 2026-09-04)

Atsauces vērtības tumsas kalkulatoram (Manikalkulatori). Rotaļīgs, pašironisks kalkulators par Baltijas ziemas tumsu, mērķēts uz novembra līdz janvāra trafika kāpumu, kad tumsa jau tāpat ir sarunu temats sociālajos tīklos, bet skaitļu avotu disciplīna ir tāda pati kā jebkuram citam kalkulatoram šajā projektā.

Statuss: izstrāde sākta (feat/tumsas-kalkulators). Kanoniskais datu avots ir repo fails claude/data/lv-riga-daylight-2026.json, šis dokuments paliek kā izpētes un lēmumu žurnāls un pirmavotu saraksts.

## Formula

gaismas_stundas(n) = D_vid + A × cos(2π × (n − n_vasaras_saulgrieži) / 365,25)

tumsas_stundas(n) = 24 − gaismas_stundas(n)

kopā_tumsas_dienas = (Σ tumsas_stundas par katru nodzīvoto dienu) ÷ 24

Sinusoidāla tuvinājuma izvēle, nevis efemerīdu aprēķins vai mēneša summu tabula: gaismas garuma gada gaita ir tuva sinusoīdai jebkurā platuma grādā, un šī vienkāršotā formula ļauj rādīt aprēķinu caurspīdīgi, dienu pa dienai, tāpat kā pārējie šī projekta kalkulatori. Precizitātes zaudējums pret reālajiem saullēkta un saulrieta laikiem ir dažas minūtes dienā tuvu saulgriežiem, kas šim rotaļīgajam kalkulatoram ir pieņemams, bet jāatrunā limitācijās.

## Sourced primitives (verificēts 2026-09-04)

| # | Parametrs | Vērtība | Avots |
|---|---|---|---|
| 1 | Garākā diena 2026 | 2026-06-21, 17 h 52 min gaismas (saullēkts 04:30, saulriets 22:23) | [sunrisesunset.io](https://sunrisesunset.io/lv/riga/riga/) |
| 2 | Īsākā diena 2026 | 2026-12-21, 6 h 43 min gaismas | [sunrisesunset.io](https://sunrisesunset.io/lv/riga/riga/) |
| 3 | Šķērspārbaude | Garākā diena apmēram 17 h 53 min, īsākā apmēram 6 h 44 līdz 47 min (2026) | [tutiempo.net](https://en.tutiempo.net/daylight-hours/riga.html) |
| 4 | Gada kopējais gaismas daudzums 2026 | 4502 h 23 min, 365 dienas gadā (2026 nav garais gads), no kā atvasināts vidējais apmēram 12 h 20 min dienā | [tutiempo.net](https://en.tutiempo.net/daylight-hours/riga.html) |
| 5 | Platums | 56,95 grādi ziemeļu platuma | [sunrisesunset.io](https://sunrisesunset.io/lv/riga/riga/) |
| 6 | Vasaras saulgriežu diena | 2026-06-21, gada 172. diena (nav garais gads) | Atvasināts no kalendāra, nav atsevišķi jāapstiprina ārējā avotā |

Nav izgūstams šajā izpētes gājienā: timeanddate.com un gaisma.com bloķēja automātisko piekļuvi (robots.txt vai 403). Ja nākotnē pieejama cita piekļuve, vērts pārbaudīt vēlreiz un citēt no turienes.

## Atvasinātie lielumi (aprēķināti kodā, ne ar roku ierakstīti)

- D_vid (vidējais gaismas garums) = gada kopējais gaismas daudzums ÷ dienu skaits gadā = 4502 h 23 min ÷ 365 ≈ 12,335 h ≈ 12 h 20 min, matches rindu 4.
- A (amplitūda) = (garākā diena − īsākā diena) ÷ 2 = (17 h 52 min − 6 h 43 min) ÷ 2 = 5,575 h = 5 h 34,5 min, matches uzdevumā doto vērtību.

Abi atvasinājumi notiek lib/calculators/tumsas-kalkulators-defaults.ts, nevis ir atsevišķi ar roku ierakstīti skaitļi, lai tie paliktu precīzi saskaņoti ar avotu skaitļiem.

## Mēneša sadalījums (papildu, nav obligāti izmantots MVP aprēķinā)

Avots: [tutiempo.net](https://en.tutiempo.net/daylight-hours/riga.html), stundas:minūtes kopējais gaismas daudzums mēnesī, 2026. gads.

| Mēnesis | Stundas:minūtes |
|---|---|
| Janvāris | 230:11 |
| Februāris | 261:24 |
| Marts | 361:57 |
| Aprīlis | 423:45 |
| Maijs | 507:34 |
| Jūnijs | 531:44 |
| Jūlijs | 534:39 |
| Augusts | 474:37 |
| Septembris | 388:33 |
| Oktobris | 326:21 |
| Novembris | 248:03 |
| Decembris | 213:35 |

## MVP darbības joma (fiksēts 2026-09-04)

- Ievade: pilns dzimšanas datums (diena, mēnesis, gads), ne tikai gads, jo aprēķins strādā dienas izšķirtspējā.
- Tumsa nozīmē sauli zem horizonta, izslēdzot krēslu, redzama atruna, ne zemsvītras piezīme (Baltijas vasaras naktis reti ir pilnīgi tumšas).
- Sinusoidāls tuvinājums, ne efemerīdu aprēķins vai mēneša summu tabula.
- Nav nākotnes vai paredzamā mūža ilguma projekcijas MVP, iezīmēts kā iespējams nākamais solis.
- Pieņem Rīgas platumu visam nodzīvotajam laikam, pat ja lietotājs dzīvojis citur, tas jāatrunā kā ierobežojums.

## Avoti (verificēti 2026-09-04)

- [sunrisesunset.io, Rīga](https://sunrisesunset.io/lv/riga/riga/)
- [tutiempo.net, Rīgas gaismas stundas](https://en.tutiempo.net/daylight-hours/riga.html)
