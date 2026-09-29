import {defineField, defineType} from 'sanity'

// Referenced by both the homepage's 3-item preview and the full In the News
// page's 5-item archive — 3 of those 5 are the same articles today,
// hand-copied with slightly different link text. One document per article
// fixes that drift.
export default defineType({
  name: 'newsMention',
  title: 'News Mention',
  type: 'document',
  description: 'A press mention or article about MFSN.',
  fields: [
    defineField({name: 'headline', title: 'Headline', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'outletLogo',
      title: 'Outlet logo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe what is shown, for screen readers and SEO.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'byline', title: 'Byline', type: 'string'}),
    defineField({
      name: 'citation',
      title: 'Citation',
      type: 'string',
      description: 'e.g. "Parrish Village News, April 2026 — Page 53".',
    }),
    defineField({name: 'url', title: 'Article URL', type: 'url', validation: (rule) => rule.required()}),
    defineField({
      name: 'linkLabel',
      title: 'Link label',
      type: 'string',
      description: 'e.g. "Read Article →" or "Watch Video / Read Article →".',
      initialValue: 'Read Article',
    }),
  ],
  preview: {
    select: {title: 'headline', subtitle: 'byline', media: 'outletLogo'},
  },
})
