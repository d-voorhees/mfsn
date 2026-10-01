import {defineField, defineType} from 'sanity'

// Used everywhere a labeled link is needed (actions, nav items, resource
// links, footer legal links). Enforces exactly one destination (page, uploaded file, or URL) so editors
// can't accidentally leave a link pointing nowhere or pointing two places.
const DESTINATION_FIELD = {internal: 'internalLink', file: 'file', external: 'externalUrl'} as const

// Shows only the destination field matching the "Link to" choice. Links saved
// before the choice existed have no linkType; they keep showing whichever
// destination they already have.
const hideUnless = (type: keyof typeof DESTINATION_FIELD) => ({parent}: {parent?: Record<string, unknown>}) => {
  const chosen = parent?.linkType
  if (!chosen) return !parent?.[DESTINATION_FIELD[type]]
  return chosen !== type
}

export default defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link to',
      type: 'string',
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
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
      hidden: hideUnless('internal'),
    }),
    defineField({
      name: 'file',
      title: 'Uploaded file',
      type: 'reference',
      to: [{type: 'uploadedFile'}],
      description: 'Pick a PDF or document from Uploads. Add new files under Uploads in the left menu.',
      hidden: hideUnless('file'),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      // A plain string rather than Sanity's 'url' type: that type adds its own
      // http/https-only check that can't be loosened, which rejects mailto:,
      // tel: and # anchors.
      type: 'string',
      description: 'Include mailto: or tel: links here too. Use # for an on-page anchor.',
      hidden: hideUnless('external'),
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          // "#" or "#section" jumps within the page.
          if (value.startsWith('#')) return true
          return /^(https?:\/\/|mailto:|tel:)\S+$/i.test(value)
            ? true
            : 'Enter a full URL (https://...), a mailto: or tel: link, or # for an on-page anchor.'
        }),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      // An entirely empty link is valid here; required-ness is enforced by the parent field.
      if (!value) return true
      const chosen = value.linkType as keyof typeof DESTINATION_FIELD | undefined
      if (chosen) {
        return (value as Record<string, unknown>)[DESTINATION_FIELD[chosen]]
          ? true
          : 'Fill in the destination you selected.'
      }
      const hasInternal = Boolean(value?.internalLink)
      const hasExternal = Boolean(value?.externalUrl)
      const hasFile = Boolean(value?.file)
      const count = [hasInternal, hasExternal, hasFile].filter(Boolean).length
      if (count > 1) {
        return 'Choose only one destination: an internal page, an uploaded file, or an external URL.'
      }
      if (count === 0) {
        return 'Choose an internal page, an uploaded file, or an external URL.'
      }
      return true
    }),
  preview: {
    select: {title: 'label', internal: 'internalLink.title', external: 'externalUrl', file: 'file.title'},
    prepare({title, internal, external, file}) {
      return {
        title: title || 'Untitled link',
        subtitle: internal ? `→ ${internal}` : file ? `→ ${file}` : external,
      }
    },
  },
})
