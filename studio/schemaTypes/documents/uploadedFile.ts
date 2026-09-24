import {defineField, defineType} from 'sanity'

// The site's upload library: PDFs, Word docs, spreadsheets, etc. Editors add
// a file here once, then pick it from any link (buttons, resource links,
// link lists) or from the "Link to an upload" option in body text. Files are
// served from Sanity's CDN, so there is no /uploads folder to keep in sync.
export default defineType({
  name: 'uploadedFile',
  title: 'Upload',
  type: 'document',
  description: 'A downloadable file (PDF, document, spreadsheet). Add it here, then link to it from any page.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown in the picker when linking, e.g. "Fast Facts: Food Prices and Hunger (Sept 2026)".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.txt',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Internal note',
      type: 'text',
      rows: 2,
      description: 'Optional. For editors only; not shown on the site.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'file.asset.originalFilename'},
  },
  orderings: [
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
    {title: 'Newest first', name: 'newest', by: [{field: '_createdAt', direction: 'desc'}]},
  ],
})
