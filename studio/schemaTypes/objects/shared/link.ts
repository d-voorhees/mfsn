import {defineField, defineType} from 'sanity'

// Used everywhere a labeled link is needed (actions, nav items, resource
// links, footer legal links). Enforces exactly one destination (page, uploaded file, or URL) so editors
// can't accidentally leave a link pointing nowhere or pointing two places.
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
      name: 'internalLink',
      title: 'Internal page',
      type: 'reference',
      to: [{type: 'page'}],
    }),
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
      validation: (rule) =>
        rule.uri({allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel']}),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      // An entirely empty link is valid here; required-ness is enforced by the parent field.
      if (!value) return true
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
