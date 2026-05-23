const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'P', 'UL', 'OL', 'LI', 'A', 'BLOCKQUOTE'])

function stripUnsupportedAttributes(element: Element) {
  const allowedAttributes = element.tagName === 'A' ? new Set(['href', 'target', 'rel']) : new Set<string>()

  for (const attribute of Array.from(element.attributes)) {
    if (!allowedAttributes.has(attribute.name)) {
      element.removeAttribute(attribute.name)
    }
  }
}

export function sanitizeReviewHtml(value: string): string {
  if (!value.trim()) return ''
  if (typeof window === 'undefined') return value

  const parser = new DOMParser()
  const document = parser.parseFromString(value, 'text/html')

  for (const element of Array.from(document.body.querySelectorAll('*'))) {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes))
      continue
    }

    if (element.tagName === 'A') {
      const href = element.getAttribute('href')?.trim() || ''

      if (!/^https?:\/\//i.test(href)) {
        element.replaceWith(...Array.from(element.childNodes))
        continue
      }

      element.setAttribute('href', href)
      element.setAttribute('target', '_blank')
      element.setAttribute('rel', 'noopener noreferrer sponsored')
    }

    stripUnsupportedAttributes(element)
  }

  return document.body.innerHTML.trim()
}

export function reviewHtmlToText(value: string): string {
  if (!value.trim()) return ''
  if (typeof window === 'undefined') return value

  const parser = new DOMParser()
  const document = parser.parseFromString(value, 'text/html')

  return document.body.textContent?.trim() || ''
}
