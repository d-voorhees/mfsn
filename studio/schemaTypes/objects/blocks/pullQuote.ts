import {defineField, defineType} from 'sanity'

// Single occurrence today (Our Strategy), but a stable, distinct contract
// (large quote + attribution) not shared with any other block, so it earns
// its own type rather than being force-fit into richTextSection.
export default defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  description: 'A large attributed quote.',
  fields: [
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3, validation: (rule) => rule.required()}),
    defineField({
      name: 'citationName',
      title: 'Citation name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'citationDetail',
      title: 'Citation detail',
      type: 'string',
      description: 'e.g. role and date — "Co-Founder, Creation in Common, November 2025".',
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'citationName'},
  },
})
