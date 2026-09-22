import {defineField, defineType} from 'sanity'

// Deliberately not a raw-HTML/iframe field. Restricted to Google Maps/My
// Maps embed URLs so editors can swap the map without being able to paste
// arbitrary embed markup.
export default defineType({
  name: 'mapEmbed',
  title: 'Map embed',
  type: 'object',
  description: 'Restricted to a Google Maps / Google My Maps embed URL — no arbitrary embed code.',
  fields: [
    defineField({
      name: 'embedUrl',
      title: 'Google Maps embed URL',
      type: 'url',
      description:
        'Paste the URL from Google Maps/My Maps’ "Embed on my site" option (must start with https://www.google.com/maps/).',
      validation: (rule) =>
        rule
          .required()
          .uri({allowRelative: false, scheme: ['https']})
          .custom((value) => {
            if (typeof value === 'string' && !value.startsWith('https://www.google.com/maps/')) {
              return 'Must be a Google Maps embed URL (https://www.google.com/maps/...).'
            }
            return true
          }),
    }),
    defineField({
      name: 'title',
      title: 'Accessible title',
      type: 'string',
      description: 'Describes the map for screen readers, e.g. "Manatee Food Mapping".',
      validation: (rule) => rule.required(),
    }),
  ],
})
