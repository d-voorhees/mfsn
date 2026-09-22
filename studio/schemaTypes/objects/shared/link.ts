import {defineField, defineType} from 'sanity'

// Used everywhere a labeled link is needed (actions, nav items, resource
// links, footer legal links). Enforces exactly one destination so editors
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
      const hasInternal = Boolean(value?.internalLink)
      const hasExternal = Boolean(value?.externalUrl)
      if (hasInternal && hasExternal) {
        return 'Choose either an internal page or an external URL, not both.'
      }
      if (!hasInternal && !hasExternal) {
        return 'Choose an internal page or an external URL.'
      }
      return true
    }),
  preview: {
    select: {title: 'label', internal: 'internalLink.title', external: 'externalUrl'},
    prepare({title, internal, external}) {
      return {
        title: title || 'Untitled link',
        subtitle: internal ? `→ ${internal}` : external,
      }
    },
  },
})
