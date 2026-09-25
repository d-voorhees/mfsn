import {defineField, defineType} from 'sanity'

// Built for the homepage's "Why Food Matters" section: a big stacked
// statement heading beside a short fact list, with no image at all. This is
// a genuinely different shape from textImageSection (no media slot) and
// richTextSection (heading is the visual anchor, not prose), so it gets its
// own minimal block rather than being force-fit into either.
export default defineType({
  name: 'statementHighlight',
  title: 'Statement Highlight',
  type: 'object',
  description:
    'A large stacked statement heading beside a short list of supporting facts, with no image. Used for a single strong framing moment (e.g. "Why Food Matters").',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Displayed as a large, stacked statement.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'facts',
      title: 'Facts',
      type: 'array',
      of: [{type: 'string'}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: 'Statement Highlight', subtitle: heading}
    },
  },
})
