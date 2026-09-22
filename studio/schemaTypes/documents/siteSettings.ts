import {defineField, defineType} from 'sanity'

// Singleton: exactly one of these should ever exist. Enforced in
// sanity.config.ts (custom desk structure item + restricted document
// actions), not by anything in this schema file itself.
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Global, site-wide content: logo, navigation, footer, and default SEO.',
  fields: [
    defineField({name: 'siteName', title: 'Site name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt', validation: (rule) => rule.required()}),
    defineField({
      name: 'navigation',
      title: 'Primary navigation',
      type: 'array',
      of: [{type: 'navigationItem'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      fields: [
        defineField({name: 'contactPhone', title: 'Contact phone', type: 'string'}),
        defineField({name: 'contactEmail', title: 'Contact email', type: 'string'}),
        defineField({
          name: 'locationText',
          title: 'Location text',
          type: 'string',
          description: 'e.g. "Bradenton, Florida".',
        }),
        defineField({
          name: 'copyrightText',
          title: 'Copyright text',
          type: 'string',
          description: 'e.g. "Copyright © 2026 All rights reserved - Manatee Food Security Network".',
        }),
        defineField({name: 'legalLinks', title: 'Legal links', type: 'array', of: [{type: 'link'}]}),
      ],
    }),
    defineField({name: 'defaultSeo', title: 'Default SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'siteName'},
  },
})
