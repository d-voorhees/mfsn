import {defineField, defineType} from 'sanity'

// Every one of the 15 source pages opens with this exact shape: full-bleed
// image, dark overlay, centered title box. The homepage additionally has a
// description and two CTAs — that's handled as optional fields here rather
// than a second hero type, since the DOM/CSS contract is identical.
export default defineType({
  name: 'heroCentered',
  title: 'Hero (Centered)',
  type: 'object',
  description: 'Full-bleed image hero with a centered title. Used at the top of every page.',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'imageWithAlt',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'actions',
      title: 'Actions',
      type: 'array',
      of: [{type: 'action'}],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
  },
})
