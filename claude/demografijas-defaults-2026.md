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
default for dzimušie gadā.

### 3. Mirušie 2025

value: 26 109; unit: cilvēki; reference period: 2025; source name: CSP, PxWeb table
IRS010, indicator DEATH; exact URL:
https://data.stat.gov.lv/pxweb/lv/OSP_PUB/START__POP__IR__IRS/IRS010/; PxWeb table
code: IRS010; retrieval date: 2026-09-03; provisional: no.

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

## Still open before Checkpoint 2

1. IRS031 (regional/town population) has not been pulled yet for the "Mērogs"
   engagement module's comparison town. That table is confirmed reachable by the same
   API method (folder `POP/IR/IRS`, table `IRS031`) and will be pulled when that module
   is built in Checkpoint 3; flagged here only so it is not forgotten, not required for
   Checkpoint 1's nine rows.
2. School-class-size figures for the same module (also Checkpoint 3, not sourced yet).
