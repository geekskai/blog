"use client"

import React from "react"
import { useTranslations } from "next-intl"
import UnicodeToolTemplate from "../upside-down-text-generator/components/UnicodeToolTemplate"

export default function ZalgoTextGeneratorPage() {
  const t = useTranslations("ZalgoTextGenerator")

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
      label: t("related_tools.strikethrough.label"),
      href: "/tools/strikethrough-text-generator/",
      description: t("related_tools.strikethrough.description"),
    },
    {
      label: t("related_tools.fancy_text.label"),
      href: "/tools/fancy-text-generator/",
      description: t("related_tools.fancy_text.description"),
    },
    {
      label: t("related_tools.discord_font.label"),
      href: "/tools/discord-font-generator/",
      description: t("related_tools.discord_font.description"),
    },
    {
      label: t("related_tools.vaporwave.label"),
      href: "/tools/vaporwave-text-generator/",
      description: t("related_tools.vaporwave.description"),
    },
  ]

  return (
    <UnicodeToolTemplate
      badgeEmoji="👾"
      badgeText={t("badge_text")}
      title={t("seo_title")}
      description={t("seo_description")}
      tldr={t("tldr")}
      keywordLabel={t("keyword_label")}
      lastUpdated="2026-03-03"
      enabledEffectIds={[
        "plain",
        "tail-mark",
        "lightning",
        "zalgo",
        "strikethrough",
        "wavy-underline",
      ]}
      useCaseItems={useCaseItems}
      boundaryItems={boundaryItems}
      relatedTools={relatedTools}
      faqItems={faqItems}
      seoSynonyms={t("seo_keywords").split(", ")}
      bestFor={t("best_for")}
      keyBenefit={t("key_benefit")}
      defaultInput={t("default_input")}
    />
  )
}
