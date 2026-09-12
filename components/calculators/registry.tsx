import type { ComponentType } from 'react';
import { ElektroautoVsBenzinaCalculator } from './ElektroautoVsBenzinaCalculator';
import { EkiiAtbalstsCalculator } from './EkiiAtbalstsCalculator';
import { KaskoCalculator } from './KaskoCalculator';
import { OctaCalculator } from './OctaCalculator';
import { LizingsVsKreditsCalculator } from './LizingsVsKreditsCalculator';
import { DegvielasIzmaksasCalculator } from './DegvielasIzmaksasCalculator';
import { UzladesIzmaksasCalculator } from './UzladesIzmaksasCalculator';
import { NolietojumsCalculator } from './NolietojumsCalculator';
import { RiepuIzmeraCalculator } from './RiepuIzmeraCalculator';
import { CelaIzmaksasCalculator } from './CelaIzmaksasCalculator';
import { SolaruAtmaksasCalculator } from './SolaruAtmaksasCalculator';
import { SiltumsuknaAtmaksasCalculator } from './SiltumsuknaAtmaksasCalculator';
import { ElektribasRekinaCalculator } from './ElektribasRekinaCalculator';
import { ApkuresIzmaksasCalculator } from './ApkuresIzmaksasCalculator';
import { MalkasApjomaCalculator } from './MalkasApjomaCalculator';
import { KrasasDaudzumaCalculator } from './KrasasDaudzumaCalculator';
import { FlizuDaudzumaCalculator } from './FlizuDaudzumaCalculator';
import { BetonaApjomaCalculator } from './BetonaApjomaCalculator';
import { JumtaSegumaDaudzumaCalculator } from './JumtaSegumaDaudzumaCalculator';
import { TapetesDaudzumaCalculator } from './TapetesDaudzumaCalculator';
import { KiegeluBlokuDaudzumaCalculator } from './KiegeluBlokuDaudzumaCalculator';
import { JavasApmetumaDaudzumaCalculator } from './JavasApmetumaDaudzumaCalculator';
import { GipskartonaLoksnuDaudzumaCalculator } from './GipskartonaLoksnuDaudzumaCalculator';
import { GrantsSmiltsSkembuApjomaCalculator } from './GrantsSmiltsSkembuApjomaCalculator';
import { TerasesDeluDaudzumaCalculator } from './TerasesDeluDaudzumaCalculator';
import { LaminataVinilaDaudzumaCalculator } from './LaminataVinilaDaudzumaCalculator';
import { PasizlidzinosasJavasDaudzumaCalculator } from './PasizlidzinosasJavasDaudzumaCalculator';
import { ZogaMateriaLaDaudzumaCalculator } from './ZogaMateriaLaDaudzumaCalculator';
import { SkriesanasTempaCalculator } from './SkriesanasTempaCalculator';
import { TriatlonaPlanotajaCalculator } from './TriatlonaPlanotajaCalculator';
import { FtpZonuCalculator } from './FtpZonuCalculator';
import { SirdsdarbibasZonuCalculator } from './SirdsdarbibasZonuCalculator';
import { PeldesanasCssCalculator } from './PeldesanasCssCalculator';
import { EkspluatacijasNodoklaCalculator } from './EkspluatacijasNodoklaCalculator';
import { UznemumaAutoNodoklaCalculator } from './UznemumaAutoNodoklaCalculator';
import { MaratonaLaikaPrognozesCalculator } from './MaratonaLaikaPrognozesCalculator';
import { Vo2maxCalculator } from './Vo2maxCalculator';
import { TreninaKalorijuCalculator } from './TreninaKalorijuCalculator';
import { KmiKalkulators } from './KmiKalkulators';
import { KalorijuNormasCalculator } from './KalorijuNormasCalculator';
import { TaukuProcentaCalculator } from './TaukuProcentaCalculator';
import { IdealaSvaraCalculator } from './IdealaSvaraCalculator';
import { UdensNormasCalculator } from './UdensNormasCalculator';
import { KreditaKalkulators } from './KreditaKalkulators';
import { GrutniecibasTerminaCalculator } from './GrutniecibasTerminaCalculator';
import { OvulacijasCalculator } from './OvulacijasCalculator';
import { PromilesCalculator } from './PromilesCalculator';
import { HipotekasMaksajumaCalculator } from './HipotekasMaksajumaCalculator';
import { HipotekasParmaksasCalculator } from './HipotekasParmaksasCalculator';
import { PvnKalkulators } from './PvnKalkulators';
import { UzkrajumuCalculator } from './UzkrajumuCalculator';
import { Pensiju3LimenaCalculator } from './Pensiju3LimenaCalculator';
import { IeguldijumuKontaCalculator } from './IeguldijumuKontaCalculator';
import { SiltinajumaBiezumaCalculator } from './SiltinajumaBiezumaCalculator';
import { VentilacijasApjomaCalculator } from './VentilacijasApjomaCalculator';
import { LoguPlatibasCalculator } from './LoguPlatibasCalculator';
import { InflacijasCalculator } from './InflacijasCalculator';
import { AtvalinajumaNaudasCalculator } from './AtvalinajumaNaudasCalculator';
import { MunKalkulators } from './MunKalkulators';
import { SlimibasNaudasCalculator } from './SlimibasNaudasCalculator';
import { AlgaNetoCalculator } from './AlgaNetoCalculator';
import { AlgaBrutoCalculator } from './AlgaBrutoCalculator';
import { IpasumaNodoklaCalculator } from './IpasumaNodoklaCalculator';
import { SaimnieciskasDarbibasCalculator } from './SaimnieciskasDarbibasCalculator';
import { IinKalkulators } from './IinKalkulators';

/**
 * Props every calculator component receives from the calculator page.
 * `accentVar` comes from the category record in `lib/registry.ts` — the single
 * source of truth for category accent colours — so components never hardcode it.
 */
export interface CalculatorComponentProps {
  accentVar: string;
}

export const calculatorComponents: Record<string, ComponentType<CalculatorComponentProps>> = {
  'elektroauto-vs-benzina': ElektroautoVsBenzinaCalculator,
  'ekii-atbalsts': EkiiAtbalstsCalculator,
  'kasko-kalkulators': KaskoCalculator,
  'octa-kalkulators': OctaCalculator,
  'lizings-vs-kredits': LizingsVsKreditsCalculator,
  'degvielas-izmaksas': DegvielasIzmaksasCalculator,
  'uzlades-izmaksas': UzladesIzmaksasCalculator,
  'nolietojums': NolietojumsCalculator,
  'riepu-izmers': RiepuIzmeraCalculator,
  'cela-izmaksas': CelaIzmaksasCalculator,
  'solaru-atmaksa': SolaruAtmaksasCalculator,
  'siltumsukna-atmaksa': SiltumsuknaAtmaksasCalculator,
  'elektribas-rekins': ElektribasRekinaCalculator,
  'apkures-izmaksas': ApkuresIzmaksasCalculator,
  'malkas-apjoms': MalkasApjomaCalculator,
  'krasas-daudzums': KrasasDaudzumaCalculator,
  'flizu-daudzums': FlizuDaudzumaCalculator,
  'betona-apjoms': BetonaApjomaCalculator,
  'jumta-seguma-daudzums': JumtaSegumaDaudzumaCalculator,
  'tapetes-daudzums': TapetesDaudzumaCalculator,
  'kiegelu-bloku-daudzums': KiegeluBlokuDaudzumaCalculator,
  'javas-apmetuma-daudzums': JavasApmetumaDaudzumaCalculator,
  'gipskartona-loksnu-daudzums': GipskartonaLoksnuDaudzumaCalculator,
  'grants-smilts-skembu-apjoms': GrantsSmiltsSkembuApjomaCalculator,
  'terases-delu-daudzums': TerasesDeluDaudzumaCalculator,
  'laminata-vinila-daudzums': LaminataVinilaDaudzumaCalculator,
  'pasizlidzinosas-javas-daudzums': PasizlidzinosasJavasDaudzumaCalculator,
  'zoga-materiala-daudzums': ZogaMateriaLaDaudzumaCalculator,
  'skriesanas-temps': SkriesanasTempaCalculator,
  'triatlona-planotajs': TriatlonaPlanotajaCalculator,
  'ftp-zonas': FtpZonuCalculator,
  'sirdsdarbibas-zonas': SirdsdarbibasZonuCalculator,
  'peldesanas-css': PeldesanasCssCalculator,
  'ekspluatacijas-nodoklis': EkspluatacijasNodoklaCalculator,
  'uznemuma-auto-nodoklis': UznemumaAutoNodoklaCalculator,
  'maratona-laika-prognoze': MaratonaLaikaPrognozesCalculator,
  'vo2max': Vo2maxCalculator,
  'trenina-kalorijas': TreninaKalorijuCalculator,
  'kmi-kalkulators': KmiKalkulators,
  'kaloriju-norma': KalorijuNormasCalculator,
  'tauku-procents': TaukuProcentaCalculator,
  'idealais-svars': IdealaSvaraCalculator,
  'udens-norma': UdensNormasCalculator,
  'kredita-kalkulators': KreditaKalkulators,
  'grutniecibas-termins': GrutniecibasTerminaCalculator,
  'ovulacija': OvulacijasCalculator,
  'promiles': PromilesCalculator,
  'hipotekas-maksajums': HipotekasMaksajumaCalculator,
  'hipotekas-parmaksa': HipotekasParmaksasCalculator,
  'pvn-kalkulators': PvnKalkulators,
  'uzkrajumi': UzkrajumuCalculator,
  'pensiju-3-limena-kalkulators': Pensiju3LimenaCalculator,
  'ieguldijumu-konta-nodoklu-kalkulators': IeguldijumuKontaCalculator,
  'siltinajuma-biezuma-kalkulators': SiltinajumaBiezumaCalculator,
  'ventilacijas-apjoma-kalkulators': VentilacijasApjomaCalculator,
  'logu-platibas-kalkulators': LoguPlatibasCalculator,
  'inflacija': InflacijasCalculator,
  'atvalinajuma-nauda': AtvalinajumaNaudasCalculator,
  'mun-kalkulators': MunKalkulators,
  'slimibas-nauda': SlimibasNaudasCalculator,
  'alga-neto': AlgaNetoCalculator,
  'alga-bruto': AlgaBrutoCalculator,
  'ipasuma-nodoklis': IpasumaNodoklaCalculator,
  'saimnieciska-darbiba': SaimnieciskasDarbibasCalculator,
  'iin-kalkulators': IinKalkulators,
};

export function getCalculatorComponent(slug: string): ComponentType<CalculatorComponentProps> | undefined {
  return calculatorComponents[slug];
}
