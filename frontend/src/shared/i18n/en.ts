/**
 * All user-facing copy lives here. One language for now; adding another means
 * creating a file with the same shape (the `Messages` type enforces it).
 */
export const en = {
  common: {
    continue: 'Continue',
    back: 'Back',
    retry: 'Try again',
    loading: 'Loading…',
  },
  errors: {
    network: 'No connection to the server. Check your internet and try again.',
    unexpected: 'Something went wrong. Please try again.',
  },
  app: {
    crashTitle: 'Something went wrong',
    crashText: 'Please reload the page. Your progress is saved.',
    reload: 'Reload page',
  },
  flow: {
    loading: 'Preparing your onboarding…',
    notFoundTitle: 'This link doesn’t work',
    notFoundText: (name: string) => `We couldn’t find the onboarding “${name}”.`,
    startDefault: 'Start onboarding',
    errorTitle: 'We couldn’t load the onboarding',
    emptyTitle: 'Nothing to show yet',
    emptyText: 'This onboarding has no steps we can display.',
    progress: (current: number, total: number) => `Step ${current} of ${total}`,
  },
  phone: {
    title: 'What’s your phone number?',
    subtitle: 'We’ll use it to keep your account secure.',
    label: 'Phone number',
    countryLabel: 'Country code',
    errors: {
      empty: 'Enter your phone number',
      invalid: 'This doesn’t look like a valid number for the selected country',
    },
  },
  email: {
    title: 'What’s your email?',
    subtitle: 'We’ll send your receipt and account details here.',
    label: 'Email',
    placeholder: 'name@example.com',
    errors: {
      empty: 'Enter your email',
      invalid: 'Enter a valid email, like name@example.com',
    },
  },
  quizSingle: {
    title: 'What is your main goal?',
    subtitle: 'Pick the one that matters most.',
    options: {
      fitness: 'Get fitter',
      sleep: 'Sleep better',
      focus: 'Improve focus',
      stress: 'Reduce stress',
    },
  },
  quizMulti: {
    title: 'What would you like to try?',
    subtitle: 'Select all that apply.',
    options: {
      workouts: 'Short workouts',
      meditation: 'Meditation',
      nutrition: 'Nutrition tips',
      habits: 'Habit tracking',
      breathing: 'Breathing exercises',
    },
  },
  checkout: {
    title: 'Choose your plan',
    subtitle: 'One-time payment, no hidden fees.',
    plansLabel: 'Plans',
    popular: 'Most popular',
    plansError: 'We couldn’t load plans.',
    paymentTitle: 'Payment details',
    paymentFormError: 'The payment form failed to load.',
    pay: (price: string) => `Pay ${price}`,
    verifying: 'Checking payment status…',
    processing: 'Your payment is being processed. This usually takes a few seconds…',
    stillProcessing: 'Your payment is still being processed. Check again in a moment.',
    unverified: 'We couldn’t check your payment status. You won’t be charged twice.',
    checkAgain: 'Check status',
    tryAgainHint: 'Please try again or use another payment method.',
    succeeded: 'Payment successful!',
  },
  payment: {
    notCompleted: 'The payment wasn’t completed.',
    canceled: 'This payment was canceled.',
    failed: 'The payment failed.',
    missingData: 'Some of your details are missing. Please go back and fill them in.',
  },
  success: {
    title: 'You’re all set!',
    text: (plan: string, email: string) =>
      `Your ${plan} plan is active. We’ve sent the receipt to ${email}.`,
    textNoPlan: 'Your payment was successful.',
    startOver: 'Start over',
  },
}

export type Messages = typeof en
