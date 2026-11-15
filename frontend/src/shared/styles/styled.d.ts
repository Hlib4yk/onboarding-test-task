import 'styled-components'
import type { AppTheme } from './theme'

// Makes `props.theme` fully typed in every styled component.
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
