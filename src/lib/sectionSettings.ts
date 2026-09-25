import type { SectionSettings } from '../types/sanity';

// Every value here maps to a background already defined in site.css
// (var(--bg-light), var(--accent-gold-bg), etc.) rather than a new color —
// see sectionSettings.ts's schema comment. "default" renders no inline
// style at all.
const BACKGROUND_STYLE: Record<NonNullable<SectionSettings['background']>, string | undefined> = {
  default: undefined,
  tinted: 'background-color: #f2f2f2;',
  light: 'background-color: var(--bg-light);',
  gray: 'background-color: #e9ecef;',
  gold: 'background-color: var(--accent-gold-bg);',
  white: 'background-color: #fff;',
};

export function backgroundStyle(settings?: SectionSettings): string | undefined {
  return BACKGROUND_STYLE[settings?.background ?? 'default'];
}

// The narrow centered column grid used across the source's long-form pages
// (Steering Committee's ODSD block, Data & Mapping, Talking Points, Working
// Groups, the legal pages). Slightly unifies two source variants (some
// pages used only col-md-10 offset-md-1; others added col-lg-8
// offset-lg-2 for a tighter column on very large screens) onto the fuller
// one, since both read as "centered narrow column" at ordinary widths.
export const NARROW_COLUMN_CLASS = 'col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2';

// Bootstrap spacing utilities (pt-0 / pb-0) that override the default
// `section { padding: 5em 0 }`. Driven by the "Remove top/bottom padding"
// checkboxes; the legacy padTop/padBottom === 'none' values still count.
export function paddingClass(settings?: SectionSettings): string | undefined {
  const classes = [
    settings?.removeTopPadding || settings?.padTop === 'none' ? 'pt-0' : '',
    settings?.removeBottomPadding || settings?.padBottom === 'none' ? 'pb-0' : '',
  ].filter(Boolean);
  return classes.length ? classes.join(' ') : undefined;
}
