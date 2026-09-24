import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'The title in Google results. Aim for 50–60 characters, with the main keyword first. Falls back to the page title if left blank.',
      validation: (rule) =>
        rule.max(60).warning('Titles over about 60 characters get cut off in search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'The summary under the title in Google results. Aim for 120–160 characters and say what the page offers.',
      validation: (rule) =>
        rule
          .required()
          .warning('Add a meta description so search engines show a useful summary.')
          .min(70)
          .warning('Under about 70 characters is usually too short to be useful.')
          .max(160)
          .warning('Descriptions over about 160 characters get cut off in search results.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Social share image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
