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
    defineField({name: 'outletName', title: 'Outlet name', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'outletLogo', title: 'Outlet logo', type: 'imageWithAlt'}),
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
    defineField({
      name: 'featured',
      title: 'Featured on homepage',
      type: 'boolean',
      description: 'Controls which mentions appear in the homepage preview grid.',
      initialValue: false,
    }),
    defineField({name: 'publishedAt', title: 'Published date', type: 'date'}),
  ],
  orderings: [
    {title: 'Published date, new first', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'headline', subtitle: 'outletName', media: 'outletLogo'},
  },
})
