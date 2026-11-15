import { en, type Messages } from './en'

/**
 * Current messages. A deliberately tiny i18n layer: when a second language appears,
 * this becomes a lookup by locale (or gets replaced by i18next) without touching call sites.
 */
export const t: Messages = en
