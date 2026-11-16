import { t } from '@/shared/i18n'
import { Button } from '@/shared/ui/Button'
import { StatusScreen } from '@/shared/ui/StatusScreen'

/** Last-resort screen for unexpected render errors (incl. a failed lazy chunk download). */
export function CrashScreen() {
  return (
    <StatusScreen
      title={t.app.crashTitle}
      text={t.app.crashText}
      actions={
        <Button
          onClick={() => {
            window.location.reload()
          }}
        >
          {t.app.reload}
        </Button>
      }
    />
  )
}
