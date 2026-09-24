import {defineArrayMember} from 'sanity'

// The rich-text block used by every page-builder body field. Adds two link
// types beyond Sanity's default external-URL link: a link to another page on
// the site, and a link to a file from the Uploads library.
export const bodyBlock = defineArrayMember({
  type: 'block',
  marks: {
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'External link',
        fields: [
          {
            name: 'href',
            type: 'url',
            title: 'URL',
            validation: (rule) =>
              rule.uri({allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel']}),
          },
        ],
      },
      {
        name: 'internalLink',
        type: 'object',
        title: 'Link to a page',
        fields: [{name: 'page', type: 'reference', title: 'Page', to: [{type: 'page'}]}],
      },
      {
        name: 'fileLink',
        type: 'object',
        title: 'Link to an upload',
        fields: [{name: 'upload', type: 'reference', title: 'Upload', to: [{type: 'uploadedFile'}]}],
      },
    ],
  },
})
