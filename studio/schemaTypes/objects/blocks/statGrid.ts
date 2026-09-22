import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'statGrid',
  title: 'Stat Grid',
  type: 'object',
  description: 'A row of large numbers with labels, e.g. "75+ Member Organizations". Each stat can optionally link elsewhere.',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      options: {
        list: [
          {title: 'Two', value: 'two'},
          {title: 'Three', value: 'three'},
          {title: 'Four', value: 'four'},
        ],
      },
      initialValue: 'three',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'itemStyle',
      title: 'Item style',
      type: 'string',
      description: '"Banded" wraps each stat in a bordered box (used for the Navigator Pilot Program stats); "Plain" is unboxed (used for the homepage At a Glance stats).',
      options: {
        list: [
          {title: 'Plain', value: 'plain'},
          {title: 'Banded (bordered box)', value: 'band'},
        ],
      },
      initialValue: 'plain',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'stat',
          title: 'Stat',
          fields: [
            defineField({
              name: 'number',
              title: 'Number / value',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'link', title: 'Link', type: 'link'}),
          ],
          preview: {select: {title: 'number', subtitle: 'label'}},
        },
      ],
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Stat grid'}
    },
  },
})
