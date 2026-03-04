"use client"

import React from "react"
import { useTranslations } from "next-intl"
import UnicodeToolTemplate from "../upside-down-text-generator/components/UnicodeToolTemplate"

export default function VaporwaveTextGeneratorPage() {
  const t = useTranslations("VaporwaveTextGenerator")

  const faqItems = [
    { q: t("faq.items.0.q"), a: t("faq.items.0.a") },
    { q: t("faq.items.1.q"), a: t("faq.items.1.a") },
    { q: t("faq.items.2.q"), a: t("faq.items.2.a") },
    { q: t("faq.items.3.q"), a: t("faq.items.3.a") },
    { q: t("faq.items.4.q"), a: t("faq.items.4.a") },
    { q: t("faq.items.5.q"), a: t("faq.items.5.a") },
    { q: t("faq.items.6.q"), a: t("faq.items.6.a") },
    { q: t("faq.items.7.q"), a: t("faq.items.7.a") },
  ]

  const useCaseItems = [t("use_cases.0"), t("use_cases.1"), t("use_cases.2"), t("use_cases.3")]

  const boundaryItems = [t("boundaries.0"), t("boundaries.1"), t("boundaries.2"), t("boundaries.3")]

  const relatedTools = [
    {
      label: t("related_tools.fancy_text.label"),
      href: "/tools/fancy-text-generator/",
      description: t("related_tools.fancy_text.description"),
    },
    {
      label: t("related_tools.instagram_bio.label"),
      href: "/tools/instagram-bio-fonts/",
      description: t("related_tools.instagram_bio.description"),
    },
    {
      label: t("related_tools.bubble_letter.label"),
      href: "/tools/bubble-letter-generator/",
      description: t("related_tools.bubble_letter.description"),
    },
    {
      label: t("related_tools.zalgo.label"),
      href: "/tools/zalgo-text-generator/",
      description: t("related_tools.zalgo.description"),
    },
  ]

  return (
    <UnicodeToolTemplate
      badgeEmoji="🌈"
      badgeText={t("badge_text")}
      title={t("seo_title")}
      description={t("seo_description")}
      tldr={t("tldr")}
      keywordLabel={t("keyword_label")}
      lastUpdated="2026-03-04"
      enabledEffectIds={["plain", "fullwidth", "sans-bold", "double-struck"]}
      useCaseItems={useCaseItems}
      boundaryItems={boundaryItems}
      relatedTools={relatedTools}
      faqItems={faqItems}
      seoSynonyms={t("seo_keywords").split(", ")}
      bestFor={t("best_for")}
      keyBenefit={t("key_benefit")}
      defaultInput={t("default_input")}
      allowComposer={true}
      allowEmojiWrapper={true}
    />
  )
}
