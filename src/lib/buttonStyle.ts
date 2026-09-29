// Sanity offers two button styles: filled gold ("primary") or outline.
// Anything else (legacy 'outlineGold' values) renders as outline.
export function buttonClass(style?: string): string {
  return style === 'outline' || style === 'outlineGold' ? 'btn-cta-outline-gold' : 'btn-cta';
}
