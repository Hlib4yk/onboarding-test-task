/** Catalogue of all analytics events. Adding an event = adding a union member. */
export type AnalyticsEvent =
  | { name: 'flow_loaded'; flow: string; skippedScreens: string[] }
  | { name: 'flow_failed'; code: string }
  | { name: 'screen_view'; screen: string }
  | { name: 'phone_submitted'; country: string }
  | { name: 'email_submitted' }
  | { name: 'quiz_answered'; questionId: string; answers: string[] }
  | { name: 'plan_selected'; planId: string }
  | { name: 'payment_submitted'; planId: string }
  | { name: 'payment_succeeded'; paymentId: string; planId: string | null }
  | { name: 'payment_failed'; paymentId: string | null; reason: string }

/** Anything that can receive events: console, GA, Amplitude, … */
export interface AnalyticsTransport {
  send(event: AnalyticsEvent): void
}

const consoleTransport: AnalyticsTransport = {
  send: (event) => {
    console.info('[analytics]', event.name, event)
  },
}

const transports: AnalyticsTransport[] = [consoleTransport]

/** Single entry point used by the whole app. */
export const analytics = {
  track(event: AnalyticsEvent): void {
    for (const transport of transports) transport.send(event)
  },
}
