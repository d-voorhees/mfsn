import {defineField, defineType} from 'sanity'
import {bodyBlock} from '../shared/bodyBlock'

// Built specifically for Our Strategy's "2026 Focus" section: two focus
// areas presented side by side, each with its own heading, image, and body
// copy. Kept distinct from textImageSection because that pattern's contract
// is one image against one text column — this is two full text+image
// columns paired together, a different layout contract.
export default defineType({
  name: 'twoColumnImageSection',
  title: 'Two-Column Image Section',
  type: 'object',
  description:
    'Two side-by-side columns, each with its own heading, image, and body copy — for presenting two related focus areas together.',
  fields: [
    defineField({name: 'heading', title: 'Section heading', type: 'string'}),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'column',
          title: 'Column',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'imageWithAlt',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [bodyBlock],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'noteText',
              title: 'Note text',
              type: 'string',
              description: 'Optional bold callout line shown just before the action, e.g. "This project will be in partnership with the Women’s Resource Center."',
            }),
            defineField({name: 'actions', title: 'Actions', type: 'array', of: [{type: 'action'}]}),
          ],
          preview: {select: {title: 'heading', media: 'image'}},
        },
      ],
      validation: (rule) => rule.length(2).error('Exactly two columns are required.'),
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Two-column image section'}
    },
  },
})
