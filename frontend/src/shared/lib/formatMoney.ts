/** Formats an amount in minor units (cents) as a price, e.g. 1499, "eur" -> "€14.99". */
export function formatMoney(amountMinor: number, currency: string, locale = 'en'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountMinor / 100)
}
