import {defineField, defineType} from 'sanity'

// A link plus a visual style. The three styles here are the three button
// treatments actually used in the source CSS (btn-cta, btn-cta-outline,
// btn-cta-outline-gold) — not an open-ended style picker.
export default defineType({
  name: 'action',
  title: 'Action',
  type: 'object',
  fields: [
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Visual style',
      type: 'string',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Outline', value: 'outline'},
          {title: 'Outline (gold)', value: 'outlineGold'},
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'link.label', subtitle: 'style'},
    prepare({title, subtitle}) {
      return {title: title || 'Untitled action', subtitle}
    },
  },
})
