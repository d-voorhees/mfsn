import {defineField, defineType} from 'sanity'

// hotspot:true so cropping stays correct across the many aspect ratios these
// images get rendered at (hero backgrounds, square cards, logo tiles, etc).
export default defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe what is shown, for screen readers and SEO.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
})
