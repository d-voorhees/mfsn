import {defineField, defineType} from 'sanity'

// A heading over a row of colored pill links that jump to anchors further
// down the page (e.g. the Resources page's "Resource Topics" index).
export default defineType({
  name: 'tagList',
  title: 'Tag List',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'tag',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'anchorId',
              title: 'Anchor ID',
              type: 'string',
              description: 'The Anchor ID of the section to jump to, without the #.',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'anchorId'}},
        },
      ],
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: 'Tag List', subtitle: heading}
    },
  },
})
