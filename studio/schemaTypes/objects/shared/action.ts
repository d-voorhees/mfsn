import {defineField, defineType} from 'sanity'

// A link plus a visual style: a filled gold button or an outline button
// (the treatment used on the resource page). Not an open-ended style picker.
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
          {title: 'Regular (filled gold)', value: 'primary'},
          {title: 'Outline', value: 'outline'},
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
