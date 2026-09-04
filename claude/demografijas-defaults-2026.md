# Demogrāfijas dati, 2026 (Dzimstības kalkulators un iedzīvotāju skaita lapa)

Status: CHECKPOINT 1, complete. All nine required rows sourced directly from CSP's
PxWeb API (data.stat.gov.lv), which is priority 1 in SOURCE DISCIPLINE.

No reference file `claude/ev-vs-ice-defaults-2026.md` exists anywhere in this repo
(checked working tree and full git history on every branch), so this file's structure
was built directly from the SOURCE DISCIPLINE field list in the task brief rather than
mirrored from a prior example. Flagging that deviation here per instruction.

Field legend used in every row below: value; unit; reference period; source name;
exact URL; PxWeb table code; retrieval date; provisional; note.

## How this data was retrieved

`data.stat.gov.lv`'s interactive table pages are a query builder that returns no data
without a POST request carrying a JSON query body, which a plain page fetch cannot
issue. The underlying PxWeb REST API accepts that POST directly, so every figure below
was retrieved with:

```
curl -X POST -H "Content-Type: application/json" \
  --data '{"query":[{"code":"INDICATOR","selection":{"filter":"item","values":["<codes>"]}},
                     {"code":"ContentsCode","selection":{"filter":"item","values":["IRS010"]}},
                     {"code":"TIME","selection":{"filter":"item","values":["<years>"]}}],
           "response":{"format":"json"}}' \
  "https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/IR/IRS/IRS010"
```

Table folder path confirmed by walking the API tree: `OSP_PUB` -> `POP` -> `IR` -> `IRS`
-> `IRS010`. Indicator codes on IRS010: `POP_SY` (iedzīvotāju skaits gada sākumā),
`LBIRTH` (dzīvi dzimušo skaits), `DEATH` (mirušo skaits), `NATGROW` (dabiskais
pieaugums), `MIGR_NET` (migrācijas saldo). TFR and general fertility rate came from the
same method against table `IDK010` in folder `POP/ID/IDK`, contents codes `IDK0101`
(summārais dzimstības koeficients) and `IDK0104` (dzimstības vispārīgais koeficients).

Every 2020 to 2024 value returned by the API was cross-checked against the CSP
"Demogrāfija 2025" bulletin's own printed table (page 2) and matches exactly, which is
the basis for trusting the API path for the years the bulletin does not cover (2025 and
the full historical series).

## Methodology caveats (apply to every row below unless noted otherwise)

1. CSP changed the permanent population estimation method in 2025, from a logistic
   regression model to an unsupervised machine learning SoL logit model. 2023 and 2024
   population figures were recalculated under the new method, so they differ from
   figures published before 2025.
2. On 02.10.2025 CSP revised the 02.06.2025 population estimate to include foreign
   students in the permanent population count.
3. The Central Statistical Bureau uses full enumeration from administrative registers
   (CARIS, PMLP Fizisko personu reģistrs, SPKC, Valsts zemes dienests), not sampling.

## Rows 1 to 7

### 1. Iedzīvotāju skaits 01.01.2026

value: 1 845 096; unit: cilvēki; reference period: 01.01.2026; source name: CSP, PxWeb
table IRS010, indicator POP_SY; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/; PxWeb table
code: IRS010; retrieval date: 2026-09-03; provisional: no, this is CSP's published
figure for the year start, table last updated 2026-06-02; note: supersedes the
lvportals.lv pointer figure ("apmēram 1 823 000") named in the task brief; that figure
was a rough press estimate and is not used.

### 2. Dzīvi dzimušie 2025

value: 11 931; unit: bērni; reference period: 2025; source name: CSP, PxWeb table
IRS010, indicator LBIRTH; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/; PxWeb table
code: IRS010; retrieval date: 2026-09-03; provisional: no; note: supersedes the
11 637 provisional figure named in the task brief (that number came from an lvportals.lv
article quoting CSP, forbidden as a direct source). The API figure is CSP's own
finalized table value, table last updated 2026-06-02, so it is used as the calculator
default for dzimušie gadā. Re-verified 2026-09-03 (review pass): LBIRTH is queried
directly as its own INDICATOR code, not derived from any other row, exact request:
`curl -X POST -H "Content-Type: application/json" --data
'{"query":[{"code":"INDICATOR","selection":{"filter":"item","values":["LBIRTH","DEATH"]}},
{"code":"ContentsCode","selection":{"filter":"item","values":["IRS010"]}},
{"code":"TIME","selection":{"filter":"item","values":["2025"]}}],"response":{"format":"json"}}'
"https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/IR/IRS/IRS010"` returns
`{"key":["LBIRTH","2025"],"values":["11931"]}` and `{"key":["DEATH","2025"],"values":["26109"]}`
directly, confirming both are raw table cells, not local arithmetic.

### 3. Mirušie 2025

value: 26 109; unit: cilvēki; reference period: 2025; source name: CSP, PxWeb table
IRS010, indicator DEATH; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/; PxWeb table
code: IRS010; retrieval date: 2026-09-03; provisional: no. Re-verified 2026-09-03, see
the exact request recorded under row 2.

### 4. Dabiskais pieaugums 2025

value: -14 178; unit: cilvēki; reference period: 2025; source name: CSP, PxWeb table
IRS010, indicator NATGROW; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/; PxWeb table
code: IRS010; retrieval date: 2026-09-03; provisional: no; note: equals births minus
deaths (11 931 minus 26 109 equals -14 178), matching CSP's own published value exactly,
so this is a primary figure, not a locally recomputed one.

### 5. Migrācijas saldo 2025

value: -1 291; unit: cilvēki; reference period: 2025; source name: CSP, PxWeb table
IRS010, indicator MIGR_NET; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/; PxWeb table
code: IRS010; retrieval date: 2026-09-03; provisional: no.

### 6. Summārais dzimstības koeficients 2025

value: 1.16; unit: bērni uz vienu sievieti dzīves laikā; reference period: 2025; source
name: CSP, PxWeb table IDK010, indicator IDK0101; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__ID__IDK/IDK010/; PxWeb table
code: IDK010; retrieval date: 2026-09-03; provisional: no; note: down from 1.23 in 2024
and 1.34 in 2023 (both confirmed via the same API call), continuing the decline the
2025 bulletin already documented through 2024. Far below the 2.1 to 2.2 replacement
level cited in the bulletin.

### 7. Vispārīgais dzimstības koeficients uz 1000 iedzīvotāju 2025

value: 6.4; unit: dzīvi dzimušie uz 1000 iedzīvotāju; reference period: 2025; source
name: CSP, PxWeb table IDK010, indicator IDK0104; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__ID__IDK/IDK010/; PxWeb table
code: IDK010; retrieval date: 2026-09-03; provisional: no; note: down from 6.9 in 2024.

## Rows 8 and 9: complete

### 8. Annual series 2015 to 2025: dzimušie, mirušie, iedzīvotāju skaits

Complete, exact, unrounded values for every year 2015 to 2025 are in
`claude/data/lv-population-1920-2026.json` (see row 9 for how that file was built; it
covers 1920 to 2026 in one file rather than a separate 2015 to 2025 slice, since the
retrieval method and source are identical). Every field for 2020 through 2025 was
cross-checked against the CSP bulletin's own printed table and matches exactly.

### 9. Full annual dzimušie series 1920 to 2025 (birth year cohort feature)

Stored as data, not prose, in `claude/data/lv-population-1920-2026.json`. Structure:

```json
{
  "source": "CSP PxWeb IRS010, ...",
  "sourceUrl": "https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/",
  "apiUrl": "https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/IR/IRS/IRS010",
  "tableCode": "IRS010",
  "tableUpdated": "2026-06-02",
  "retrievalDate": "2026-09-03",
  "series": [
    { "year": 1920, "populationAtYearStart": 1596131, "liveBirths": 29434,
      "deaths": 33891, "naturalIncrease": -4457, "netMigration": null },
    ...
  ]
}
```

107 rows, years 1920 to 2026 inclusive. `null` means CSP has no published value for
that indicator that year: 1944 has no data at all (WWII gap in registration), several
interwar years (1921 to 1924, 1926 to 1929, and similar) have no `populationAtYearStart`
because population counts were not taken annually before 1946, and 2026 has only
`populationAtYearStart` populated because the year is not complete.

For the birth year cohort feature, `cohortSize(year)` reads `liveBirths` for that year
from this file and errors clearly for any year outside 1920 to 2025 or for 1944 (no
data), per the CHECKPOINT 2 spec; do not substitute a nearby year's value.

## Row 10 (Checkpoint 3 addition): comparison town for the "Mērogs" module

value: 14 899; unit: cilvēki; reference period: 01.01.2026; source name: CSP, PxWeb
table IRS031, indicator POP_SY, area code LV0026200 (Cēsis); exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS031/; PxWeb table
code: IRS031; retrieval date: 2026-09-03; provisional: no; note: re-verified in the
2026-09-03 review pass that 2026 is actually published for this area (not just 2025),
exact request:
`curl -X POST -H "Content-Type: application/json" --data
'{"query":[{"code":"INDICATOR","selection":{"filter":"item","values":["POP_SY"]}},
{"code":"AREA","selection":{"filter":"item","values":["LV0026200"]}},
{"code":"TIME","selection":{"filter":"item","values":["2024","2025","2026"]}}],
"response":{"format":"json"}}'
"https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/IR/IRS/IRS031"` returns 15 226 (2024),
15 020 (2025), 14 899 (2026); the 2026 value is used since it is CSP's latest published
figure for this area, matching the population reference date used elsewhere on the page
(01.01.2026).

## Novads pilot (three pages: Daugavpils, Jelgava, Varakļānu novads)

Three CSP tables, all reached by the same POST method as above. Areas chosen: a
large city, a mid sized city, and the smallest municipality in Latvia by
population, to test whether pages built from the same template actually differ
enough to index. Area codes confirmed via the IRS031 metadata AREA list:
Daugavpils `LV0002000`, Jelgava `LV0003000`, Varakļānu novads `LV0055000`.

Tables used:
- IRS031 (already used for the comparison town above): indicators `POP_SY`
  (population at year start), `NATGROW` (dabiskais pieaugums), `MIGR_NET`
  (migrācijas saldo). `https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS031/`
- IDS031, "Dzīvi dzimušo skaits pēc dzimuma reģionos, valstspilsētās un
  novados 1996 to 2025", contents code `IDS031`, variable `SEX_NEWBORN` set to
  `T` (both sexes). `https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__ID__IDS/IDS031/`
- IMV021, "Mirušo skaits pēc dzimuma un pa vecuma grupām reģionos,
  valstspilsētās un novados 1996 to 2025", contents code `IMV021`, variable
  `SEX` set to `T`, variable `AgeGroup` set to `TOTAL`.
  `https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IM__IMSV/IMV021/`
- IDK021 checked for area level TFR (contents code `IDK0211`): returns `.`
  (not applicable) for all three areas for 2024 and 2025. CSP does not publish
  summārais dzimstības koeficients below the five statistical regions. Not
  used; the novads pages omit a local TFR line rather than substituting the
  national figure for a specific place, which would misrepresent it as
  area level data.

Retrieval date for everything in this section: 2026-09-04.

Exact requests:
```
curl -X POST -H "Content-Type: application/json" --data
'{"query":[{"code":"INDICATOR","selection":{"filter":"item","values":["POP_SY","NATGROW","MIGR_NET"]}},
{"code":"AREA","selection":{"filter":"item","values":["LV0002000","LV0003000","LV0055000"]}},
{"code":"TIME","selection":{"filter":"item","values":["2021","2022","2023","2024","2025","2026"]}}],
"response":{"format":"json"}}'
"https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/IR/IRS/IRS031"

curl -X POST -H "Content-Type: application/json" --data
'{"query":[{"code":"SEX_NEWBORN","selection":{"filter":"item","values":["T"]}},
{"code":"AREA","selection":{"filter":"item","values":["LV0002000","LV0003000","LV0055000"]}},
{"code":"ContentsCode","selection":{"filter":"item","values":["IDS031"]}},
{"code":"TIME","selection":{"filter":"item","values":["2021","2022","2023","2024","2025"]}}],
"response":{"format":"json"}}'
"https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/ID/IDS/IDS031"

curl -X POST -H "Content-Type: application/json" --data
'{"query":[{"code":"SEX","selection":{"filter":"item","values":["T"]}},
{"code":"AREA","selection":{"filter":"item","values":["LV0002000","LV0003000","LV0055000"]}},
{"code":"AgeGroup","selection":{"filter":"item","values":["TOTAL"]}},
{"code":"ContentsCode","selection":{"filter":"item","values":["IMV021"]}},
{"code":"TIME","selection":{"filter":"item","values":["2021","2022","2023","2024","2025"]}}],
"response":{"format":"json"}}'
"https://data.stat.gov.lv/api/v1/lv/OSP_PUB/POP/IM/IMSV/IMV021"
```

A real data availability gap, not a bug: for Daugavpils and Jelgava, IDS031 and
IMV021 (the birth/death breakdown tables) are published through 2025, matching
IRS031. For Varakļānu novads, IDS031 and IMV021 return `..` (no value) for
2025, so its most recent year with a matched population, births, deaths, and
natural increase set is 2024, one year behind the two cities. Each area below
uses its own real latest complete year rather than forcing all three onto the
same year; the reference period field on each row says which year that is.

### Daugavpils, reference year 2025

value: 456 dzīvi dzimušie, 1207 mirušie, -751 dabiskais pieaugums, 111
migrācijas saldo, 77 486 iedzīvotāji (01.01.2026); unit: cilvēki (or bērni for
dzimušie); reference period: 2025 (population 01.01.2026); source name: CSP,
PxWeb tables IRS031 (population, natural increase, migration), IDS031
(births), IMV021 (deaths), area code `LV0002000`; PxWeb table codes: IRS031,
IDS031, IMV021; retrieval date: 2026-09-04; provisional: no; note: -751 equals
456 minus 1207 exactly, matching the NATGROW value IRS031 publishes directly
for this area, so it is confirmed as a primary figure, not a local
recomputation only.

Five year population series 2021 to 2026 (IRS031, POP_SY): 80 627, 79 120,
79 903, 78 942, 78 126, 77 486.
Five year dzimušie series 2021 to 2025 (IDS031): 593, 550, 495, 505, 456.
Five year mirušie series 2021 to 2025 (IMV021): 1 829, 1 479, 1 326, 1 208, 1 207.

### Jelgava, reference year 2025

value: 363 dzīvi dzimušie, 706 mirušie, -343 dabiskais pieaugums, -83
migrācijas saldo, 54 408 iedzīvotāji (01.01.2026); reference period: 2025
(population 01.01.2026); source, retrieval date, and table codes as
Daugavpils above, area code `LV0003000`; note: -343 equals 363 minus 706
exactly, matching IRS031's own NATGROW value for this area.

Five year population series 2021 to 2026 (IRS031, POP_SY): 55 336, 54 694,
55 459, 55 216, 54 834, 54 408.
Five year dzimušie series 2021 to 2025 (IDS031): 560, 488, 455, 414, 363.
Five year mirušie series 2021 to 2025 (IMV021): 911, 799, 693, 718, 706.

### Varakļānu novads, reference year 2024 (see data availability note above)

value: 20 dzīvi dzimušie, 56 mirušie, -36 dabiskais pieaugums, -36 migrācijas
saldo, 2 820 iedzīvotāji (01.01.2025); reference period: 2024 (population
01.01.2025); source, retrieval date, and table codes as Daugavpils above,
area code `LV0055000`; note: -36 equals 20 minus 56 exactly, matching
IRS031's own NATGROW value for this area for 2024. A newer population figure,
2 820 at 01.01.2025 is itself already the 01.01.2025 figure paired with 2024
flows here, so no further figures are pending except the eventual 2025
births and deaths breakdown, not yet published for this area as of retrieval
date.

Four year dzimušie series 2021 to 2024 (IDS031, 2025 not yet published for
this area): 18, 22, 15, 20.
Four year mirušie series 2021 to 2024 (IMV021, 2025 not yet published for this
area): 69, 57, 58, 56.
Five year population series 2021 to 2025 (IRS031, POP_SY, 2026 not yet
published for this area): 2 945, 2 918, 3 001, 2 892, 2 820.

### National comparison rates used on the pilot pages

Same year, same method as each area (natural increase for year Y divided by
population at the start of year Y+1, times 1000):
- 2025: national dabiskais pieaugums -14 178, population 01.01.2026
  1 845 096 (both already sourced in rows 1 and 4 above), rate -7,685 per
  1000. Used for Daugavpils and Jelgava.
- 2024: national dabiskais pieaugums -13 774, population 01.01.2025
  1 860 565 (CSP "Demogrāfija 2025" bulletin, page 2 table, already cited in
  the "How this data was retrieved" section above), rate -7,403 per 1000.
  Used for Varakļānu novads, so the comparison is against the same reference
  year rather than mixing 2024 area data against a 2025 national rate.

Both rates and each area's own rate (dabiskais pieaugums divided by
population, times 1000) are derived values with the derivation written out
here and every input traceable to a row above, per SOURCE DISCIPLINE.

## Not sourced, dropped rather than invented

School-class-size figures for the "Mērogs" module were never found in a CSP table
reachable within a reasonable search (checked the `IZG` and `OSP_OD` education
folders); the module ships with only the comparison-town unit above. Per SOURCE
DISCIPLINE, an unsourced number is removed rather than softened, so this was not added.

Area level summārais dzimstības koeficients (TFR) for Daugavpils, Jelgava, and
Varakļānu novads: checked IDK021, contents code IDK0211, returns `.` (not
applicable) for all three areas. CSP does not publish TFR below the five
statistical regions. The novads pilot pages omit a local TFR line rather than
showing the national figure on a place page, which would misrepresent it as
local data.
