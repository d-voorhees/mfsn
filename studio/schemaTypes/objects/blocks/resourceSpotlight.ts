import {defineField, defineType} from 'sanity'
import {bodyBlock} from '../shared/bodyBlock'

// Distinct from textImageSection despite the similar media+text look: this
// block carries a repeatable resource-links list, which textImageSection
// does not have.
export default defineType({
  name: 'resourceSpotlight',
  title: 'Resource Spotlight',
  type: 'object',
  description:
    'A resource entry: media, heading, body copy, and a list of resource links. Used for the Resources & Safe Spaces library.',
  fields: [
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Short labels shown as pills above the heading.',
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({name: 'media', title: 'Media', type: 'imageWithAlt'}),
    defineField({
      name: 'mediaPosition',
      title: 'Media position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
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
      name: 'resourceLinks',
      title: 'Resource links',
      type: 'array',
      of: [{type: 'link'}],
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {heading: 'heading', media: 'media'},
    prepare({heading, media}) {
      return {title: 'Resource Spotlight', subtitle: heading, media}
    },
  },
})
