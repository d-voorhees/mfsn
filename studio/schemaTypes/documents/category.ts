import {defineField, defineType} from 'sanity'

// Keeps the Resources page's top tag-navigation and each row's tag pills
// pointing at the same underlying label/color, instead of two hand-typed
// lists that can drift out of sync.
export default defineType({
  name: 'category',
  title: 'Resource Category',
  type: 'document',
  description: 'A topic tag used to organize resource spotlights, e.g. "Accessibility" or "Seniors & Elderly".',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'colorKey',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Blue', value: 'blue'},
          {title: 'Orange', value: 'orange'},
          {title: 'Pink', value: 'pink'},
          {title: 'Green', value: 'green'},
        ],
      },
      initialValue: 'blue',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label'},
  },
})
