// Every Sanity-derived TypeScript shape lives in this one file, per the
// project's standing constraint to never scatter these across components.
// Field names mirror the Studio schemas 1:1 (studio/schemaTypes/**).

export interface SanityImage {
  asset: {_ref: string; _type: 'reference'}
  hotspot?: {x: number; y: number; height: number; width: number}
  alt: string
  caption?: string
}

// Portable Text is intentionally left as a loose block shape here — the
// renderer (src/lib/portableText.ts) treats it opaquely and Sanity's own
// PortableTextBlock type would pull in the full editor-side schema, which
// this project doesn't need.
export type PortableTextBlock = Record<string, unknown>

export interface SeoData {
  metaTitle?: string
  metaDescription?: string
  shareImage?: SanityImage
  noIndex?: boolean
}

export interface SectionSettings {
  background?: 'default' | 'tinted' | 'light' | 'gray' | 'gold' | 'white'
  width?: 'narrow' | 'standard'
  alignment?: 'left' | 'center'
  anchorId?: string
}

export interface LinkData {
  label: string
  internalLink?: {slug: {current: string}}
  externalUrl?: string
}

export interface ActionData {
  link: LinkData
  style: 'primary' | 'outline' | 'outlineGold'
}

export interface MapEmbedData {
  embedUrl: string
  title: string
}

export interface NavigationLinkData {
  label: string
  link: LinkData
}

export interface NavigationItemData {
  label: string
  link?: LinkData
  dropdownItems?: NavigationLinkData[]
}

export interface SiteSettingsData {
  siteName: string
  logo: SanityImage
  navigation: NavigationItemData[]
  footer?: {
    contactPhone?: string
    contactEmail?: string
    locationText?: string
    copyrightText?: string
    legalLinks?: LinkData[]
  }
  defaultSeo?: SeoData
}

export interface CategoryData {
  _id: string
  label: string
  colorKey: 'blue' | 'orange' | 'pink' | 'green'
}

export interface NewsMentionData {
  _id: string
  headline: string
  outletName: string
  outletLogo?: SanityImage
  excerpt?: PortableTextBlock[]
  byline?: string
  citation?: string
  url: string
  linkLabel?: string
  featured?: boolean
  publishedAt?: string
}

// --- Page-builder blocks ---
// Each interface's `_type` is the schema `name` from studio/schemaTypes/objects/blocks/*.
// PageBlock (bottom of file) is the discriminated union PageBuilder.astro switches on.

export interface HeroCenteredBlock {
  _type: 'heroCentered'
  _key: string
  eyebrow?: string
  heading: string
  subheading?: string
  description?: string
  image: SanityImage
  actions?: ActionData[]
}

export interface RichTextColumn {
  headingText?: string
  headingTag?: 'h3' | 'h4'
  body: PortableTextBlock[]
}

export interface RichTextSectionBlock {
  _type: 'richTextSection'
  _key: string
  icon?: SanityImage
  eyebrow?: string
  heading?: string
  proseStyle: 'default' | 'quote' | 'lead' | 'spotlight'
  body: PortableTextBlock[]
  // Used instead of `body` when the source laid out two side-by-side
  // heading+list groups (e.g. the homepage's Navigator Pilot Program
  // outcomes) rather than one flowing column.
  columns?: RichTextColumn[]
  caveatText?: string
  mapEmbed?: MapEmbedData
  actions?: ActionData[]
  settings?: SectionSettings
}

export interface TextImageCallout {
  heading?: string
  body?: string
  style: 'pink' | 'card'
  position: 'left' | 'right'
  action?: ActionData
}

export interface TextImageSectionBlock {
  _type: 'textImageSection'
  _key: string
  eyebrow?: string
  heading: string
  proseStyle: 'default' | 'spotlight'
  // 'checklist' applies the custom checkmark-bullet list treatment
  // (.resources-list) instead of a browser-default bulleted list.
  listStyle?: 'default' | 'checklist'
  body?: PortableTextBlock[]
  image?: SanityImage
  imageStyle: 'natural' | 'cover' | 'rounded' | 'logo'
  mediaPosition: 'left' | 'right' | 'none'
  linkList?: LinkData[]
  actions?: ActionData[]
  callout?: TextImageCallout
  settings?: SectionSettings
}

export interface TwoColumnImageColumn {
  heading: string
  image: SanityImage
  body: PortableTextBlock[]
  noteText?: string
  actions?: ActionData[]
}

export interface TwoColumnImageSectionBlock {
  _type: 'twoColumnImageSection'
  _key: string
  heading?: string
  columns: TwoColumnImageColumn[]
  settings?: SectionSettings
}

export type FeatureGridMarkerIconKey =
  | 'connection'
  | 'funding'
  | 'voice'
  | 'data-sharing'
  | 'resources'
  | 'discussions'
  | 'coordination'
  | 'messaging'

export interface FeatureGridItem {
  markerIconKey?: FeatureGridMarkerIconKey
  markerImage?: SanityImage
  title: string
  description?: string
  action?: ActionData
}

export interface FeatureGridBlock {
  _type: 'featureGrid'
  _key: string
  icon?: SanityImage
  heading?: string
  columns: 'two' | 'three' | 'four'
  markerStyle: 'icon' | 'number' | 'numeral' | 'logoImage' | 'none'
  items: FeatureGridItem[]
  trailingLink?: LinkData
  settings?: SectionSettings
}

export interface StatGridStat {
  number: string
  label: string
  link?: LinkData
}

export interface StatGridBlock {
  _type: 'statGrid'
  _key: string
  heading?: string
  columns: 'two' | 'three' | 'four'
  itemStyle: 'plain' | 'band'
  stats: StatGridStat[]
  settings?: SectionSettings
}

export interface CalloutBandBlock {
  _type: 'calloutBand'
  _key: string
  label: string
  statement: string
  body?: string
  color: 'blue' | 'green'
}

export interface PullQuoteBlock {
  _type: 'pullQuote'
  _key: string
  quote: string
  citationName: string
  citationDetail?: string
}

export interface ResourceSpotlightBlock {
  _type: 'resourceSpotlight'
  _key: string
  tags: CategoryData[]
  heading: string
  subheading?: string
  media?: SanityImage
  mediaPosition: 'left' | 'right'
  body: PortableTextBlock[]
  resourceLinks?: LinkData[]
  settings?: SectionSettings
}

export interface StatementHighlightBlock {
  _type: 'statementHighlight'
  _key: string
  heading: string
  facts: string[]
  settings?: SectionSettings
}

export interface NewsGridBlock {
  _type: 'newsGrid'
  _key: string
  heading: string
  mentions: NewsMentionData[]
  trailingLink?: LinkData
}

export interface LogoCloudPartner {
  name: string
  logo?: SanityImage
  logoOnDarkBg?: boolean
  url?: string
}

export interface LogoCloudBlock {
  _type: 'logoCloud'
  _key: string
  heading?: string
  display: 'fullCards' | 'chips'
  partners: LogoCloudPartner[]
}

export interface TeamGridPerson {
  name: string
  role?: string
  photo?: SanityImage
  email?: string
}

export interface TeamGridBlock {
  _type: 'teamGrid'
  _key: string
  heading?: string
  intro?: string
  introImage?: SanityImage
  display: 'cards' | 'list'
  people: TeamGridPerson[]
}

export interface NewsletterSignupBlock {
  _type: 'newsletterSignup'
  _key: string
  heading: string
  description?: string
  formAction?: string
}

export type PageBlock =
  | HeroCenteredBlock
  | RichTextSectionBlock
  | TextImageSectionBlock
  | TwoColumnImageSectionBlock
  | FeatureGridBlock
  | StatGridBlock
  | CalloutBandBlock
  | PullQuoteBlock
  | ResourceSpotlightBlock
  | StatementHighlightBlock
  | NewsGridBlock
  | LogoCloudBlock
  | TeamGridBlock
  | NewsletterSignupBlock

export interface PageData {
  _id: string
  title: string
  slug: {current: string}
  seo?: SeoData
  pageBuilder?: PageBlock[]
}
