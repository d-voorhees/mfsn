import {defineField, defineType} from 'sanity'

// Partners are authored inline here rather than as a shared `partner`
// document (an earlier draft of this schema had one; struck per an explicit
// decision to keep the content model simpler). This means Our Network's
// full roster and Unite Us's curated subset of the same organizations are
// entered independently and won't stay in sync automatically — an
// accepted tradeoff for the simpler model.
export default defineType({
  name: 'logoCloud',
  title: 'Logo Cloud',
  type: 'object',
  description:
    'A collection of partner organizations, shown as full logo cards or compact text chips. Entries are authored directly on this block, not shared across pages.',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'display',
      title: 'Display style',
      type: 'string',
      options: {
        list: [
          {title: 'Full cards (logo + name)', value: 'fullCards'},
          {title: 'Text chips', value: 'chips'},
        ],
      },
      initialValue: 'fullCards',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'partners',
      title: 'Partners',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'partnerEntry',
          title: 'Partner',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'imageWithAlt',
              description: 'Optional for chip display; required for full-card display.',
            }),
            defineField({
              name: 'logoOnDarkBg',
              title: 'Logo needs a dark background',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({name: 'url', title: 'Website URL', type: 'url'}),
          ],
          preview: {select: {title: 'name', media: 'logo'}},
        },
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: 'Logo Cloud', subtitle: heading}
    },
  },
})
