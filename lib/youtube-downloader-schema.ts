/** Shared FAQ content builders for YouTube downloader tools. */

export type DownloaderFaqItem = {
  question: string
  answer: string
}

export type DownloaderFaqItemWithId = DownloaderFaqItem & {
  id: string
}

export function lastModifiedToIso(date: string): string {
  return `${date}T12:00:00.000Z`
}

export function buildDownloaderFaqItems(
  count: number,
  translate: (key: string) => string
): DownloaderFaqItem[] {
  return Array.from({ length: count }, (_, index) => {
    const n = index + 1
    return {
      question: translate(`faq_${n}_question`),
      answer: translate(`faq_${n}_answer`),
    }
  })
}

export function buildDownloaderFaqItemsWithIds(
  count: number,
  translate: (key: string) => string
): DownloaderFaqItemWithId[] {
  return buildDownloaderFaqItems(count, translate).map((item, index) => ({
    ...item,
    id: `faq-${index + 1}`,
  }))
}
