import { createBrowserRouter } from 'react-router'
import { ResumeRedirect } from '@/flow/ui/ResumeRedirect'
import { StepRoute } from '@/flow/ui/StepRoute'
import { AppShell } from './AppShell'
import { CrashScreen } from './CrashScreen'
import { RootLayout } from './RootLayout'

/**
 * Routes don't list screens: one dynamic route serves every step,
 * so adding a screen never touches the router.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: (
      <AppShell>
        <CrashScreen />
      </AppShell>
    ),
    children: [
      { index: true, element: <ResumeRedirect /> },
      { path: ':stepPath', element: <StepRoute /> },
      { path: '*', element: <ResumeRedirect /> },
    ],
  },
])
