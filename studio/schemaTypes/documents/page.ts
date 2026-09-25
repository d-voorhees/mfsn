import {defineField, defineType} from 'sanity'

// The generic page document: every ordinary marketing/content page on the
// site (all 15 source HTML files except none — even legal pages use
// this, with a single richTextSection block as their body) is one of these,
// composed from the approved pageBuilder block library. No page-specific
// fields, no numbered sections — see the architecture's non-negotiable
// content-modeling rules.
export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page content',
      type: 'array',
      of: [
        {type: 'heroCentered'},
        {type: 'richTextSection'},
        {type: 'textImageSection'},
        {type: 'twoColumnImageSection'},
        {type: 'featureGrid'},
        {type: 'statGrid'},
        {type: 'calloutBand'},
        {type: 'pullQuote'},
        {type: 'resourceSpotlight'},
        {type: 'statementHighlight'},
        {type: 'tagList'},
        {type: 'newsGrid'},
        {type: 'logoCloud'},
        {type: 'teamGrid'},
        {type: 'newsletterSignup'},
      ],
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'slug.current'},
  },
})
