import {defineField, defineType} from 'sanity'

// The source nav is exactly two levels deep (top-level items, some with a
// dropdown of flat links) with no further nesting anywhere in the site, so
// this models that shape directly rather than a general recursive tree.
export const navigationLink = defineType({
  name: 'navigationLink',
  title: 'Navigation link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'link', title: 'Link', type: 'link', validation: (rule) => rule.required()}),
  ],
  preview: {select: {title: 'label'}},
})

export const navigationItem = defineType({
  name: 'navigationItem',
  title: 'Navigation item',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      description: 'Optional. Leave empty if this top-level item is just a label (e.g. it only opens a dropdown).',
    }),
    defineField({
      name: 'dropdownItems',
      title: 'Dropdown items',
      type: 'array',
      of: [{type: 'navigationLink'}],
    }),
  ],
  preview: {select: {title: 'label'}},
})
