import page from './documents/page'
import siteSettings from './documents/siteSettings'
import newsMention from './documents/newsMention'
import category from './documents/category'

import link from './objects/shared/link'
import action from './objects/shared/action'
import imageWithAlt from './objects/shared/imageWithAlt'
import seo from './objects/shared/seo'
import sectionSettings from './objects/shared/sectionSettings'
import mapEmbed from './objects/shared/mapEmbed'
import {navigationItem, navigationLink} from './objects/shared/navigationItem'

import heroCentered from './objects/blocks/heroCentered'
import richTextSection from './objects/blocks/richTextSection'
import textImageSection from './objects/blocks/textImageSection'
import twoColumnImageSection from './objects/blocks/twoColumnImageSection'
import featureGrid from './objects/blocks/featureGrid'
import statGrid from './objects/blocks/statGrid'
import calloutBand from './objects/blocks/calloutBand'
import pullQuote from './objects/blocks/pullQuote'
import resourceSpotlight from './objects/blocks/resourceSpotlight'
import statementHighlight from './objects/blocks/statementHighlight'
import newsGrid from './objects/blocks/newsGrid'
import logoCloud from './objects/blocks/logoCloud'
import teamGrid from './objects/blocks/teamGrid'
import newsletterSignup from './objects/blocks/newsletterSignup'

export const schemaTypes = [
  // Documents
  page,
  siteSettings,
  newsMention,
  category,

  // Shared objects
  link,
  action,
  imageWithAlt,
  seo,
  sectionSettings,
  mapEmbed,
  navigationLink,
  navigationItem,

  // Page-builder blocks
  heroCentered,
  richTextSection,
  textImageSection,
  twoColumnImageSection,
  featureGrid,
  statGrid,
  calloutBand,
  pullQuote,
  resourceSpotlight,
  statementHighlight,
  newsGrid,
  logoCloud,
  teamGrid,
  newsletterSignup,
]
