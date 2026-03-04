"use client"

import React from "react"
import { useTranslations } from "next-intl"
import UnicodeToolTemplate from "../upside-down-text-generator/components/UnicodeToolTemplate"

export default function BubbleTextGeneratorPage() {
  const t = useTranslations("BubbleTextGenerator")

  const faqItems = t.raw("faq.items") as Array<{ q: string; a: string }>
  const useCaseItems = t.raw("use_cases") as Array<string>
  const boundaryItems = t.raw("boundaries") as Array<string>

  return (
    <UnicodeToolTemplate
      badgeEmoji="🫧"
      badgeText={t("free_tool_badge")}
      title={t("page_title")}
      description={t("seo_description")}
      tldr={t("tldr")}
      keywordLabel={t("keyword_label")}
      lastUpdated="2026-03-04"
      enabledEffectIds={[
        "plain",
        "negative-circle",
        "hollow-circle",
        "hollow-square",
        "solid-square",
      ]}
      useCaseItems={useCaseItems}
      boundaryItems={boundaryItems}
      relatedTools={[
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
          label: t("related_tools.discord_font.label"),
          href: "/tools/discord-font-generator/",
          description: t("related_tools.discord_font.description"),
        },
        {
          label: t("related_tools.vaporwave_text.label"),
          href: "/tools/vaporwave-text-generator/",
          description: t("related_tools.vaporwave_text.description"),
        },
      ]}
      faqItems={faqItems}
      seoSynonyms={t
        .raw("seo_keywords")
        .split(",")
        .map((s: string) => s.trim())}
      bestFor={t("best_for")}
      keyBenefit={t("key_benefit")}
      allowComposer={false}
      allowEmojiWrapper={false}
    />
  )
}
