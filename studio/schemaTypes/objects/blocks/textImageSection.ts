import {defineField, defineType} from 'sanity'
import {bodyBlock} from '../shared/bodyBlock'

export default defineType({
  name: 'textImageSection',
  title: 'Text + Image Section',
  type: 'object',
  description:
    'A text column paired with an image on the left or right, or text alone when media position is "None" (e.g. the Unite Us / Member Connection join-instructions layout).',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'proseStyle',
      title: 'Prose style',
      type: 'string',
      description: '"Spotlight" applies the eyebrow/title/intro typography used by the homepage’s USF Data & Mapping and ALICE sections.',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Spotlight (eyebrow/title/intro combo)', value: 'spotlight'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({
      name: 'listStyle',
      title: 'List style',
      type: 'string',
      description: 'Use "Checklist" for bullet lists that should use the site\'s custom checkmark-bullet style (e.g. the homepage resources list).',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Checklist (custom bullet)', value: 'checklist'},
        ],
      },
      initialValue: 'default',
    }),
    defineField({name: 'body', title: 'Body', type: 'array', of: [bodyBlock]}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({
      name: 'imageStyle',
      title: 'Image style',
      type: 'string',
      description: 'Each option maps to an existing image treatment in the site’s CSS.',
      options: {
        list: [
          {title: 'Natural (full graphic/photo, no crop)', value: 'natural'},
          {title: 'Cover (fills the frame, cropped)', value: 'cover'},
          {title: 'Rounded corners', value: 'rounded'},
          {title: 'Small centered logo', value: 'logo'},
        ],
      },
      initialValue: 'natural',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mediaPosition',
      title: 'Media position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
          {title: 'None (text only)', value: 'none'},
        ],
      },
      initialValue: 'right',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkList',
      title: 'Link list',
      type: 'array',
      of: [{type: 'link'}],
      description: 'Optional list of labeled links, e.g. a yearly document-archive index.',
    }),
    defineField({name: 'actions', title: 'Actions', type: 'array', of: [{type: 'action'}]}),
    defineField({
      name: 'callout',
      title: 'Callout box',
      type: 'object',
      description:
        'Optional second column shown alongside the main body when media position is "None" — e.g. Unite Us’s pink intro box, or Member Connection’s "Ready to Join" card. Leave empty for a plain single-column layout.',
      fields: [
        defineField({name: 'heading', title: 'Heading', type: 'string'}),
        defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
        defineField({
          name: 'style',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              {title: 'Pink box', value: 'pink'},
              {title: 'Bordered card', value: 'card'},
            ],
          },
          initialValue: 'pink',
        }),
        defineField({
          name: 'position',
          title: 'Position',
          type: 'string',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Right', value: 'right'},
            ],
          },
          initialValue: 'left',
        }),
        defineField({name: 'action', title: 'Action', type: 'action'}),
      ],
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (value?.mediaPosition !== 'none' && !value?.image) {
        return 'An image is required unless media position is set to "None".'
      }
      return true
    }),
  preview: {
    select: {heading: 'heading', media: 'image'},
    prepare({heading, media}) {
      return {title: 'Text + Image Section', subtitle: heading, media}
    },
  },
})
