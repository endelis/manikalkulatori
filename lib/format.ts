export function formatCurrencyEUR(value: number, opts?: { maximumFractionDigits?: number }): string {
  return new Intl.NumberFormat('lv-LV', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: opts?.maximumFractionDigits ?? 2,
    // lv-LV currency style omits the thousands separator without this
    useGrouping: true,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('lv-LV', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Latvian numeral agreement for the noun "kalkulators":
 * - counts ending in 1 (but not 11) take the nominative singular: "1 kalkulators", "21 kalkulators"
 * - zero takes the genitive plural: "0 kalkulatoru"
 * - everything else takes the nominative plural: "5 kalkulatori", "11 kalkulatori"
 */
export function pluralizeKalkulatori(count: number): string {
  if (count === 0) {
    return `${count} kalkulatoru`;
  }
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} kalkulators`;
  }
  return `${count} kalkulatori`;
}

/**
 * For a negative number that must render as a number (not spelled out in prose).
 * Prefer rephrasing the sentence to avoid a negative value entirely wherever that
 * reads naturally (e.g. "par 47 vairāk nekā dzimušo" instead of "-47"); this exists
 * only for the remaining cases where that is not practical, such as a compact table
 * or chart cell. Uses U+2212 MINUS SIGN, never the ASCII hyphen-minus (U+002D): a
 * minus sign attached to a digit is mathematical notation, not the dash/hyphen
 * punctuation the site's AI-tell ban targets. See CLAUDE.md, "Dashes, hyphens, and
 * the minus sign".
 */
export function formatSignedNumber(value: number, decimals = 0): string {
  return value < 0 ? `−${formatNumber(Math.abs(value), decimals)}` : formatNumber(value, decimals);
}

export function formatPercent(value: number, decimals = 1): string {
  return new Intl.NumberFormat('lv-LV', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}
