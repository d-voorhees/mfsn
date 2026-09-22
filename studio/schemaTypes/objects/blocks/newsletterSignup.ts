import {defineField, defineType} from 'sanity'

// formAction is a plain URL, not a raw-HTML/embed field — the actual
// Constant Contact (or equivalent) form markup lives in the Astro
// component, not in Sanity.
export default defineType({
  name: 'newsletterSignup',
  title: 'Newsletter Signup',
  type: 'object',
  description: 'An email capture prompt.',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({
      name: 'formAction',
      title: 'Form action URL',
      type: 'url',
      description: 'The signup service endpoint (e.g. a Constant Contact form action URL).',
    }),
  ],
  preview: {
    select: {title: 'heading'},
  },
})
