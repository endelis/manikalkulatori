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
import { SkriesanasTempaCalculator } from './SkriesanasTempaCalculator';
import { TriatlonaPlanotajaCalculator } from './TriatlonaPlanotajaCalculator';
import { FtpZonuCalculator } from './FtpZonuCalculator';
import { SirdsdarbibasZonuCalculator } from './SirdsdarbibasZonuCalculator';

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
  'skriesanas-temps': SkriesanasTempaCalculator,
  'triatlona-planotajs': TriatlonaPlanotajaCalculator,
  'ftp-zonas': FtpZonuCalculator,
  'sirdsdarbibas-zonas': SirdsdarbibasZonuCalculator,
};

export function getCalculatorComponent(slug: string): ComponentType<CalculatorComponentProps> | undefined {
  return calculatorComponents[slug];
}
