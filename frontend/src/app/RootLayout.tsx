import { Outlet } from 'react-router'
import { FlowGate } from '@/flow/ui/FlowGate'
import { AppShell } from './AppShell'

/** Page frame + "flow must be loaded" gate around every route. */
export function RootLayout() {
  return (
    <AppShell>
      <FlowGate>
        <Outlet />
      </FlowGate>
    </AppShell>
  )
}
