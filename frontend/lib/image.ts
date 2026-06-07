const allowedHosts = new Set([
  'images.unsplash.com',
  'res.cloudinary.com',
])

function isAllowedRemoteImageHost(hostname: string) {
  if (allowedHosts.has(hostname)) {
    return true
  }

  return hostname.endsWith('.supabase.co') || hostname.endsWith('.githubusercontent.com')
}

export function getSafeImageSrc(src: string | undefined | null, fallback: string) {
  if (!src) {
    return fallback
  }

  if (src.startsWith('/')) {
    return src
  }

  try {
    const url = new URL(src)
    if (url.protocol === 'https:' && isAllowedRemoteImageHost(url.hostname)) {
      return src
    }
  } catch {
    return fallback
  }

  return fallback
}