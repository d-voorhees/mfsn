import {defineField, defineType} from 'sanity'

// The source nav is exactly two levels deep (top-level items, some with a
// dropdown of flat links) with no further nesting anywhere in the site, so
// this models that shape directly rather than a general recursive tree.
// Menu destination: same choices as `link` but with no label field, since the
// menu item itself already has a label.
const DESTINATION_FIELD = {internal: 'internalLink', file: 'file', external: 'externalUrl'} as const

const linkTypeIs = (type: string) => ({parent}: {parent?: Record<string, unknown>}) => {
  const chosen = parent?.linkType
  // Links saved before the radio existed have no linkType; keep showing
  // whichever destination they already have.
  if (!chosen) return !parent?.[DESTINATION_FIELD[type as keyof typeof DESTINATION_FIELD]]
  return chosen !== type
}

export const navigationDestination = defineType({
  name: 'navigationDestination',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link to',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {title: 'Nothing (label only)', value: 'none'},
          {title: 'Internal page', value: 'internal'},
          {title: 'Uploaded file', value: 'file'},
          {title: 'External URL', value: 'external'},
        ],
      },
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal page',
      type: 'reference',
      to: [{type: 'page'}],
      hidden: linkTypeIs('internal'),
    }),
    defineField({
      name: 'file',
      title: 'Uploaded file',
      type: 'reference',
      to: [{type: 'uploadedFile'}],
      description: 'Pick a PDF or document from Uploads. Add new files under Uploads in the left menu.',
      hidden: linkTypeIs('file'),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Include mailto: or tel: links here too.',
      hidden: linkTypeIs('external'),
      validation: (rule) => rule.uri({allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true
      const chosen = value.linkType as keyof typeof DESTINATION_FIELD | 'none' | undefined
      if (chosen === 'none') return true
      if (chosen) {
        return (value as Record<string, unknown>)[DESTINATION_FIELD[chosen]]
          ? true
          : 'Fill in the destination you selected.'
      }
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
    defineField({
      name: 'link',
      title: 'Link',
      type: 'navigationDestination',
      validation: (rule) =>
        rule.required().custom((value) =>
          (value as {linkType?: string} | undefined)?.linkType === 'none'
            ? 'A dropdown item needs a destination.'
            : true,
        ),
    }),
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
      description: 'Optional. Choose "Nothing" if this top-level item is just a label (e.g. it only opens a dropdown).',
    }),
    defineField({
      name: 'hasDropdown',
      title: 'Add a dropdown?',
      type: 'boolean',
      options: {layout: 'switch'},
      initialValue: false,
    }),
    defineField({
      name: 'dropdownItems',
      title: 'Dropdown items',
      type: 'array',
      of: [{type: 'navigationLink'}],
      // Items saved before the toggle existed have no hasDropdown; keep them visible.
      hidden: ({parent}) => {
        const p = parent as {hasDropdown?: boolean; dropdownItems?: unknown[]} | undefined
        return p?.hasDropdown === undefined ? !p?.dropdownItems?.length : !p.hasDropdown
      },
    }),
  ],
  preview: {select: {title: 'label'}},
})
