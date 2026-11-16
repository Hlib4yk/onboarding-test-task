import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '@/shared/styles/GlobalStyle'
import { theme } from '@/shared/styles/theme'
import { router } from './router'
import { store } from './store/store'

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  )
}
