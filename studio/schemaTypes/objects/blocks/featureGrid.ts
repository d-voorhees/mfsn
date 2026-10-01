import {defineField, defineType} from 'sanity'
import {bodyBlock} from '../shared/bodyBlock'

// Icon/marker-image fields stay hidden until "Show icon?" is ticked, but
// cards that already have one set keep showing it so nothing gets lost.
const hideMarkerFields = (parent: unknown) => {
  const item = parent as {showMarker?: boolean; markerIconKey?: string; markerImage?: unknown} | undefined
  return !(item?.showMarker || item?.markerIconKey || item?.markerImage)
}

// Strongest reuse evidence in the whole site: Home's "How We Work" (numbered),
// "Strategic Pillars" (icon), "Partner With Us" (no marker); Our Strategy's
// "Four-Pronged Strategy" (numeral); Member Connection's Hylo features
// (icon — one source file's own code comment says it deliberately reuses
// this exact card CSS); Find Food Now's resource cards (logo image marker).
// markerIconKey stores a semantic key, never a raw CSS/icon class name — the
// Astro component owns the icon-key-to-Phosphor-class mapping.
export default defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  description:
    'A heading plus a row of cards, each with a marker (icon, number, numeral, or logo image), a title, and a short description. Use for process steps, strategic pillars, or partnership pathways.',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon image',
      type: 'imageWithAlt',
      description: 'Optional icon shown above the heading, e.g. the manatee icon on "Partner With Us".',
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'string',
      options: {
        list: [
          {title: 'Two', value: 'two'},
          {title: 'Three', value: 'three'},
          {title: 'Four', value: 'four'},
        ],
      },
      initialValue: 'three',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'markerStyle',
      title: 'Marker style',
      type: 'string',
      options: {
        list: [
          {title: 'Icon', value: 'icon'},
          {title: 'Number', value: 'number'},
          {title: 'Roman numeral', value: 'numeral'},
          {title: 'Logo image', value: 'logoImage'},
          {title: 'None', value: 'none'},
        ],
      },
      initialValue: 'icon',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (rule) => rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'featureItem',
          title: 'Feature item',
          fields: [
            defineField({
              name: 'showMarker',
              title: 'Show icon?',
              type: 'boolean',
              description: 'Tick to choose an icon or logo image for this card.',
              initialValue: false,
            }),
            defineField({
              name: 'markerIconKey',
              title: 'Icon',
              type: 'string',
              description: 'Used when marker style is "Icon".',
              hidden: ({parent}) => hideMarkerFields(parent),
              options: {
                list: [
                  {title: 'Connection', value: 'connection'},
                  {title: 'Funding', value: 'funding'},
                  {title: 'Voice', value: 'voice'},
                  {title: 'Data sharing', value: 'data-sharing'},
                  {title: 'Resources', value: 'resources'},
                  {title: 'Discussions', value: 'discussions'},
                  {title: 'Coordination', value: 'coordination'},
                  {title: 'Messaging', value: 'messaging'},
                ],
              },
            }),
            defineField({
              name: 'markerImage',
              title: 'Marker image',
              type: 'imageWithAlt',
              description: 'Used when marker style is "Logo image".',
              hidden: ({parent}) => hideMarkerFields(parent),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Description',
              type: 'array',
              of: [bodyBlock],
            }),
            // Plain-text description from before the rich-text field existed.
            // Only shown on cards that still have one; edit it into
            // "Description" above and clear this to move over.
            defineField({
              name: 'description',
              title: 'Description (old plain text)',
              type: 'text',
              rows: 3,
              hidden: ({parent}) => !(parent as {description?: string} | undefined)?.description,
            }),
            defineField({
              name: 'addImages',
              title: 'Add images?',
              type: 'boolean',
              description: 'Show up to two logos or images underneath this column.',
              initialValue: false,
            }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{type: 'imageWithAlt'}],
              description: 'Up to two images, shown under this column.',
              validation: (rule) => rule.max(2),
              hidden: ({parent}) => !(parent as {addImages?: boolean} | undefined)?.addImages,
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [{type: 'link'}],
              description: 'Optional. Add as many links as you like; each shows under the description.',
            }),
            // Single button from before the Links list existed. Only shown on
            // cards that still have one; re-add it under "Links" and remove it
            // here to move over.
            defineField({
              name: 'action',
              title: 'Button (old)',
              type: 'action',
              hidden: ({parent}) => !(parent as {action?: unknown} | undefined)?.action,
            }),
          ],
          preview: {select: {title: 'title', media: 'markerImage'}},
        },
      ],
    }),
    defineField({
      name: 'trailingLink',
      title: 'Trailing link',
      type: 'link',
      description: 'Optional link shown below the grid, e.g. "See our full strategy →".',
    }),
    defineField({name: 'settings', title: 'Section settings', type: 'sectionSettings'}),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: 'Feature Grid', subtitle: heading}
    },
  },
})
