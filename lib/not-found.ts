import type { NotFoundLabels } from "@/components/NotFoundPage"
import { getTranslations } from "next-intl/server"

export async function getNotFoundLabels(locale = "en"): Promise<NotFoundLabels> {
  const t = await getTranslations({ locale, namespace: "NotFound" })

  return {
    badge: t("badge"),
    title: t("title"),
    description: t("description"),
    hint: t("hint"),
    ctaHome: t("cta_home"),
    ctaTools: t("cta_tools"),
    ctaBlog: t("cta_blog"),
    terminalPrompt: t("terminal_prompt"),
    terminalCommand: t("terminal_command"),
    terminalOutput: t("terminal_output"),
    errorCode: t("error_code"),
    navLabel: t("nav_label"),
  }
}
