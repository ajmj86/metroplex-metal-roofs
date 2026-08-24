// No-op if GA4 was never initialized (NEXT_PUBLIC_GA_ID unset, or this runs
// before GoogleAnalytics.tsx's script has loaded) -- callers don't need to
// guard on that themselves.
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  gtag('event', name, params)
}
