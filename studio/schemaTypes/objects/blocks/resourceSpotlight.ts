import {defineField, defineType} from 'sanity'

// Distinct from textImageSection despite the similar media+text look: this
// block requires a tags array (which also drives the page's tag navigation)
// and a repeatable resource-links list, neither of which textImageSection
// has. That's a genuine information-architecture difference, not styling.
export default defineType({
  name: 'resourceSpotlight',
  title: 'Resource Spotlight',
  type: 'object',
  description:
    'A tagged resource entry: media, heading, body copy, and a list of resource links. Used for the Resources & Safe Spaces topic library.',
  fields: [
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      validation: (rule) => rule.required().min(1),
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
      of: [{type: 'block'}],
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
    select: {title: 'heading', media: 'media'},
  },
})
