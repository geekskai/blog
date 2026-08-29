"use client"

import {
  getSoundCloudPageCopy,
  SOUNDCLOUD_SEO_UPDATED,
  soundCloudSectionCopy,
  type SoundCloudEvidencePage,
} from "@/data/soundCloudSeo"
import { useLocale } from "next-intl"

export default function SoundCloudEvidenceContent({ page }: { page: SoundCloudEvidencePage }) {
  const locale = useLocale()
  const copy = getSoundCloudPageCopy(page, locale)
  const section = soundCloudSectionCopy[locale] ?? soundCloudSectionCopy.en

  return (
    <article className="mx-auto max-w-7xl space-y-6 md:space-y-8">
      <section className="rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-5 md:p-8">
        <time
          dateTime={SOUNDCLOUD_SEO_UPDATED}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300"
        >
          {section.verified}
        </time>
        <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl">{section.directAnswer}</h2>
        <p className="mt-4 max-w-5xl text-base leading-7 text-slate-200 md:text-lg">
          {copy.directAnswer}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <EvidenceList title={section.facts} items={copy.facts} />
        <EvidenceList title={section.steps} items={copy.steps} ordered />
        <EvidenceList title={section.limits} items={copy.limits} />
      </div>

      <section className="rounded-2xl border border-orange-300/20 bg-orange-400/5 p-5 md:p-8">
        <h2 className="text-xl font-bold text-white md:text-2xl">{section.rights}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">{section.rightsCopy}</p>
      </section>
    </article>
  )
}

function EvidenceList({
  title,
  items,
  ordered = false,
}: {
  title: string
  items: readonly string[]
  ordered?: boolean
}) {
  const List = ordered ? "ol" : "ul"

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <List
        className={`mt-4 space-y-3 text-sm leading-6 text-slate-300 ${ordered ? "list-decimal pl-5" : ""}`}
      >
        {items.map((item) => (
          <li key={item} className={ordered ? "pl-1" : "flex gap-3"}>
            {!ordered && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />}
            <span>{item}</span>
          </li>
        ))}
      </List>
    </section>
  )
}
