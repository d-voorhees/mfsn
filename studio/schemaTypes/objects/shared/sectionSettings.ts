import {defineField, defineType} from 'sanity'

// Constrained layout knobs only — every option here maps to an existing
// CSS treatment already used in the source site (e.g. the #f2f2f2 tinted
// background used to zebra-stripe sections). No arbitrary colors/spacing.
export default defineType({
  name: 'sectionSettings',
  title: 'Section settings',
  type: 'object',
  fields: [
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      description: 'Each option maps to a background color already defined in the site’s stylesheet.',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Tinted (light gray)', value: 'tinted'},
          {title: 'Light', value: 'light'},
          {title: 'Gray', value: 'gray'},
          {title: 'Gold', value: 'gold'},
          {title: 'White', value: 'white'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'width',
      title: 'Content width',
      type: 'string',
      options: {
        list: [
          {title: 'Narrow', value: 'narrow'},
          {title: 'Standard', value: 'standard'},
        ],
      },
      initialValue: 'standard',
    }),
    defineField({
      name: 'alignment',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'removeTopPadding',
      title: 'Remove top padding',
      type: 'boolean',
      description: 'Removes the default space above this section (adds the pt-0 class).',
      initialValue: false,
    }),
    defineField({
      name: 'removeBottomPadding',
      title: 'Remove bottom padding',
      type: 'boolean',
      description: 'Removes the default space below this section (adds the pb-0 class).',
      initialValue: false,
    }),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID',
      type: 'string',
      description:
        'Optional. Lets other links jump straight to this section (e.g. "fast-facts-hunger"). Lowercase letters, numbers, and hyphens only.',
      validation: (rule) =>
        rule.regex(/^[a-z0-9-]*$/, {name: 'lowercase letters, numbers, hyphens only'}),
    }),
  ],
})
