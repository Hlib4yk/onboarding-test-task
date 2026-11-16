/** Static description of a quiz question. Texts are resolved through i18n by option id. */
export interface QuizQuestion<OptionId extends string = string> {
  id: string
  options: readonly OptionId[]
}
