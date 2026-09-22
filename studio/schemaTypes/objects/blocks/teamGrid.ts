import {defineField, defineType} from 'sanity'

// People are authored inline here rather than as a shared `person`
// document (struck per an explicit decision to keep the content model
// simpler). Leadership uses photo cards; Steering Committee uses a plain
// name/org list — same underlying shape, different display.
export default defineType({
  name: 'teamGrid',
  title: 'Team Grid',
  type: 'object',
  description:
    'A collection of people, shown as photo cards or as a plain name/org list. Entries are authored directly on this block.',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro text', type: 'text', rows: 3}),
    defineField({
      name: 'introImage',
      title: 'Intro image',
      type: 'imageWithAlt',
      description: 'Optional decorative photo shown beside the heading/intro (used by the "Plain list" display, e.g. a group photo rather than an individual headshot).',
    }),
    defineField({
      name: 'display',
      title: 'Display style',
      type: 'string',
      options: {
        list: [
          {title: 'Photo cards', value: 'cards'},
          {title: 'Plain list', value: 'list'},
        ],
      },
      initialValue: 'cards',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'personEntry',
          title: 'Person',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (rule) => rule.required()}),
            defineField({name: 'role', title: 'Role / org', type: 'string'}),
            defineField({
              name: 'photo',
              title: 'Photo',
              type: 'imageWithAlt',
              description: 'Optional for plain-list display; required for photo-card display.',
            }),
            defineField({name: 'email', title: 'Email', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Team grid'}
    },
  },
})
