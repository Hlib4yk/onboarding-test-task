import { useState } from 'react'

/**
 * Decides WHEN to show a validation error (the error itself is computed by the caller):
 * - never before the user started typing;
 * - after they leave the field (blur) having typed something;
 * - or when they try to submit.
 * Once shown, the error follows the value live and disappears as soon as it becomes valid.
 */
export function useFieldError(error: string | null) {
  const [hasTyped, setHasTyped] = useState(false)
  const [revealed, setRevealed] = useState(false)

  return {
    error: revealed ? error : null,
    onChange: () => {
      setHasTyped(true)
    },
    onBlur: () => {
      if (hasTyped) setRevealed(true)
    },
    reveal: () => {
      setRevealed(true)
    },
  }
}
