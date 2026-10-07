"use client"

import { useTranslations } from "next-intl"

type DownloadConcurrencyNoticeProps = {
  limit: number
  busy?: boolean
  onRetry: () => void
}

export default function DownloadConcurrencyNotice({
  limit,
  busy = false,
  onRetry,
}: DownloadConcurrencyNoticeProps) {
  const t = useTranslations("SoundCloudService")

  return (
    <div
      className="mt-4 rounded-lg border border-amber-400/30 bg-amber-950/30 p-4 text-sm text-amber-100"
      role="alert"
      aria-live="polite"
    >
      <p className="font-medium">{t("concurrency_title")}</p>
      <p className="mt-1 leading-6">
        {t("concurrency_message", { count: limit })}
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={busy}
        className="mt-3 min-h-[40px] rounded-lg border border-amber-300/40 px-3 py-2 font-medium text-amber-100 transition-colors hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? t("concurrency_retrying") : t("concurrency_retry")}
      </button>
    </div>
  )
}
