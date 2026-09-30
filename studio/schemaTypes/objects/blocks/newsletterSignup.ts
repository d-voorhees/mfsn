import {defineField, defineType} from 'sanity'

// The signup is a plain link button (no on-site email field): buttonUrl
// points at the external signup page (e.g. a Constant Contact form).
export default defineType({
  name: 'newsletterSignup',
  title: 'CTA: Newsletter Signup',
  type: 'object',
  description: 'A heading and a button that links to an external signup page.',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'buttonLabel', title: 'Button label', type: 'string', initialValue: 'Sign Up'}),
    defineField({
      name: 'buttonUrl',
      title: 'Button link',
      type: 'url',
      description: 'Where the Sign Up button goes (e.g. your Constant Contact signup page).',
      validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto']}),
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: 'CTA: Newsletter Signup', subtitle: heading}
    },
  },
})
