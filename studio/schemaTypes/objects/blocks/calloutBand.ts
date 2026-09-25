import {defineField, defineType} from 'sanity'

// Thin cross-page evidence (only appears twice, both inside the homepage's
// Navigator Pilot Program section), but a clear, stable, self-contained
// contract that's plausible to reuse for future program updates.
export default defineType({
  name: 'calloutBand',
  title: 'CTA: Callout Band',
  type: 'object',
  description: 'A short labeled callout with a bold statement and supporting body text, color-coded.',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'statement',
      title: 'Statement',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 4}),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      description: 'Limited to the two colors the site’s CSS actually defines for this callout.',
      options: {
        list: [
          {title: 'Blue', value: 'blue'},
          {title: 'Green', value: 'green'},
        ],
      },
      initialValue: 'blue',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {label: 'label', statement: 'statement'},
    prepare({label, statement}) {
      return {title: 'CTA: Callout Band', subtitle: label || statement}
    },
  },
})
