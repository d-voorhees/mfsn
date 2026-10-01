import {useEffect} from 'react'
import {useRouter} from 'sanity/router'

// The media plugin only exposes its library as a top-level tool, so this
// Content-menu entry simply jumps to that tool.
export function MediaLibraryShortcut() {
  const router = useRouter()
  useEffect(() => {
    router.navigateUrl({path: '/media'})
  }, [router])
  return null
}
