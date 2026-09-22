import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// siteSettings is a singleton: exactly one document should ever exist.
// The desk structure below opens it directly (creating it on first visit
// instead of listing it), and the document actions/newDocumentOptions
// overrides remove "duplicate"/"delete"/"create new" for it so editors
// can't accidentally end up with two competing settings documents.
const SINGLETON_TYPES = new Set(['siteSettings'])

export default defineConfig({
  name: 'default',
  title: 'Manatee Food Security Network',

  projectId: 'js71ru0h',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(({action}) => action && !['duplicate', 'delete'].includes(action))
        : input,
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => !SINGLETON_TYPES.has(templateItem.templateId))
      }
      return prev
    },
  },
})
