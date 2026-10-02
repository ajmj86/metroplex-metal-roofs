// /visualizer runs one codebase in two variants, switched by the query string:
//   (default)       short  -> address -> material/color -> contact form
//   ?form=full      full   -> ... -> 4 quiz screens -> contact form
// Tagged `visualizer-full-form-v1` in git = the full form before this switch.
export type FormVariant = 'short' | 'full'

export function getFormVariant(search: string): FormVariant {
  return new URLSearchParams(search).get('form') === 'full' ? 'full' : 'short'
}
