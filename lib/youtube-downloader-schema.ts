/** Shared FAQ content builders and HowTo JSON-LD helpers for YouTube downloader tools */

export type DownloaderFaqItem = {
  question: string
  answer: string
}

export type DownloaderFaqItemWithId = DownloaderFaqItem & {
  id: string
}

export type DownloaderHowToSchemaInput = {
  name: string
  description: string
  steps: { name: string; text: string }[]
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

export function buildDownloaderHowToInput(
  translate: (key: string) => string
): DownloaderHowToSchemaInput {
  return {
    name: translate("schema_howto_name"),
    description: translate("schema_howto_description"),
    steps: [1, 2, 3].map((step) => ({
      name: translate(`schema_howto_step_${step}_name`),
      text: translate(`schema_howto_step_${step}_text`),
    })),
  }
}

export function generateDownloaderHowToSchema(baseUrl: string, input: DownloaderHowToSchemaInput) {
  return {
    "@type": "HowTo",
    "@id": `${baseUrl}#howto`,
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}
