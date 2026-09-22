import {defineField, defineType} from 'sanity'

// For standalone narrative/policy/list content that is NOT paired with a
// dedicated image (Vision, Steering Committee's governance blocks, Talking
// Points, legal pages, the Data & Mapping map embed, etc). textImageSection
// is the sibling pattern for when an image is a required part of the layout.
export default defineType({
  name: 'richTextSection',
  title: 'Rich Text Section',
  type: 'object',
  description:
    'Standalone narrative content: an optional icon/eyebrow/heading, followed by flowing body copy. Use for narrative, policy, or list-based prose with no dedicated image.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon image',
      type: 'imageWithAlt',
      description: 'Small optional icon shown above the heading.',
    }),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'proseStyle',
      title: 'Prose style',
      type: 'string',
      description: 'Each option maps to a distinct paragraph treatment already defined in the site’s CSS.',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Quote (large, centered)', value: 'quote'},
          {title: 'Lead-in (bold, larger)', value: 'lead'},
          {title: 'Spotlight (eyebrow/title/intro combo)', value: 'spotlight'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Leave empty when using "Columns" below instead for a two-column heading+list layout.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      description: 'Optional two-column heading+list layout (e.g. the homepage Navigator Pilot Program outcomes). Used instead of "Body" when present.',
      of: [
        {
          type: 'object',
          name: 'richTextColumn',
          title: 'Column',
          fields: [
            defineField({name: 'headingText', title: 'Heading', type: 'string'}),
            defineField({
              name: 'headingTag',
              title: 'Heading tag',
              type: 'string',
              options: {list: [{title: 'H3', value: 'h3'}, {title: 'H4', value: 'h4'}]},
              initialValue: 'h4',
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'array',
              of: [{type: 'block'}],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'headingText'}},
        },
      ],
    }),
    defineField({
      name: 'caveatText',
      title: 'Caveat text',
      type: 'text',
      rows: 2,
      description: 'Optional small note shown after the body, e.g. a data-caveat disclaimer.',
    }),
    defineField({
      name: 'mapEmbed',
      title: 'Map embed',
      type: 'mapEmbed',
      description: 'Optional. Only for sections that embed the Google Maps food-access map.',
    }),
    defineField({name: 'actions', title: 'Actions', type: 'array', of: [{type: 'action'}]}),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Rich text section'}
    },
  },
})
