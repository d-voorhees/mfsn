import {defineField, defineType} from 'sanity'

// The source nav is exactly two levels deep (top-level items, some with a
// dropdown of flat links) with no further nesting anywhere in the site, so
// this models that shape directly rather than a general recursive tree.
// Menu destination: same choices as `link` but with no label field, since the
// menu item itself already has a label.
export const navigationDestination = defineType({
  name: 'navigationDestination',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'internalLink', title: 'Internal page', type: 'reference', to: [{type: 'page'}]}),
    defineField({
      name: 'file',
      title: 'Uploaded file',
      type: 'reference',
      to: [{type: 'uploadedFile'}],
      description: 'Pick a PDF or document from Uploads. Add new files under Uploads in the left menu.',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Include mailto: or tel: links here too.',
      validation: (rule) => rule.uri({allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true
      const count = [value.internalLink, value.externalUrl, value.file].filter(Boolean).length
      if (count > 1) return 'Choose only one destination: an internal page, an uploaded file, or an external URL.'
      if (count === 0) return 'Choose an internal page, an uploaded file, or an external URL.'
      return true
    }),
})

export const navigationLink = defineType({
  name: 'navigationLink',
  title: 'Navigation link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'link', title: 'Link', type: 'navigationDestination', validation: (rule) => rule.required()}),
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
      type: 'navigationDestination',
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
