import {defineField, defineType} from 'sanity'

// References newsMention documents rather than duplicating article copy,
// since 3 of the 5 articles were previously hand-copied onto the homepage
// with slightly different link text than the full In the News page.
export default defineType({
  name: 'newsGrid',
  title: 'News Grid',
  type: 'object',
  description: 'A heading plus a curated set of news mentions.',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'mentions',
      title: 'News mentions',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'newsMention'}]}],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'trailingLink',
      title: 'Trailing link',
      type: 'link',
      description: 'e.g. "More MFSN in the News →".',
    }),
  ],
  preview: {
    select: {heading: 'heading'},
    prepare({heading}) {
      return {title: 'News Grid', subtitle: heading}
    },
  },
})
