// No-op if GA4 was never initialized (NEXT_PUBLIC_GA_ID unset, or this runs
// before GoogleAnalytics.tsx's script has loaded) -- callers don't need to
// guard on that themselves.
import { getFormVariant } from '@/lib/formVariant'

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return
  // Every visualizer_* event carries which form variant the visitor is in
  // ("short" | "full", from ?form=) so the two funnels can be compared in GA4.
  const withVariant = name.startsWith('visualizer_')
    ? { form_variant: getFormVariant(window.location.search), ...params }
    : params
  gtag('event', name, withVariant)
}
