import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'js71ru0h',
    dataset: 'production'
  },
  deployment: {
    appId: 'w5fc77vz655d2x8z7cjt0i0e',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
