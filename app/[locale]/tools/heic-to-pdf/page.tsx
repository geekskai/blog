import HeicConverter from "./components/HeicConverter"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("HeicToPdf")

  return (
    <div className="min-h-screen bg-slate-950">
      <div>
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
            <div className="text-center">
              <h1 className="mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-3xl font-bold leading-tight text-transparent sm:text-4xl md:mb-4 md:text-6xl">
                {t("title")}
              </h1>
              <p className="mx-auto max-w-3xl text-sm leading-6 text-slate-300 md:text-xl md:leading-8">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-12">
          <HeicConverter />

          {/* SEO Content Sections - Only show when no files */}
          <div className="mt-12 space-y-10 md:mt-20 md:space-y-16">
            {/* Features Section */}
            <div className="grid gap-4 md:grid-cols-3 md:gap-8">
              <div className="rounded-2xl bg-slate-900/60 p-5 text-center ring-1 ring-white/10 md:p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white md:h-16 md:w-16">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("feature_lightning_title")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("feature_lightning_description")}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-5 text-center ring-1 ring-white/10 md:p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white md:h-16 md:w-16">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("feature_quality_title")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("feature_quality_description")}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900/60 p-5 text-center ring-1 ring-white/10 md:p-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white md:h-16 md:w-16">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("feature_privacy_title")}
                </h3>
                <p className="text-sm leading-6 text-slate-400 md:text-base">
                  {t("feature_privacy_description")}
                </p>
              </div>
            </div>

            {/* How to Use Section */}
            <section className="rounded-2xl bg-slate-800 p-5 shadow-lg md:p-8">
              <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
                {t("how_to_use_title")}
              </h2>
              <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{t("how_to_step1_title")}</h3>
                      <p className="text-sm leading-6 text-slate-400 md:text-base">
                        {t("how_to_step1_description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{t("how_to_step2_title")}</h3>
                      <p className="text-sm leading-6 text-slate-400 md:text-base">
                        {t("how_to_step2_description")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{t("how_to_step3_title")}</h3>
                      <p className="text-sm leading-6 text-slate-400 md:text-base">
                        {t("how_to_step3_description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{t("how_to_step4_title")}</h3>
                      <p className="text-sm leading-6 text-slate-400 md:text-base">
                        {t("how_to_step4_description")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SEO Rich Content Sections */}
            <section className="rounded-2xl bg-slate-800 p-5 shadow-lg md:p-8">
              <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
                {t("why_choose_title")}
              </h2>
              <div className="space-y-4 text-sm leading-7 text-slate-300 md:text-base">
                <p>{t("why_choose_description")}</p>
                <p>
                  <strong className="text-white">{t("why_choose_key_features")}</strong>{" "}
                  {t("why_choose_key_features_text")}
                </p>
                <p>
                  <strong className="text-white">{t("why_choose_perfect_for")}</strong>{" "}
                  {t("why_choose_perfect_for_text")}
                </p>
              </div>
            </section>

            {/* FAQ Section with Schema */}
            <section
              className="rounded-2xl bg-slate-800 p-5 md:p-8"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              <h2 className="mb-4 text-xl font-bold leading-8 text-white md:mb-6 md:text-2xl">
                {t("faq_title")}
              </h2>
              <div className="space-y-5 md:space-y-6">
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_data_safe_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_data_safe_a")}
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_limits_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_limits_a")}
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_quality_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_quality_a")}
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_mobile_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_mobile_a")}
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_batch_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_batch_a")}
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_pdf_vs_jpeg_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_pdf_vs_jpeg_a")}
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_software_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_software_a")}
                    </p>
                  </div>
                </div>
                <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    {t("faq_customize_q")}
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm leading-6 text-slate-400 md:text-base" itemProp="text">
                      {t("faq_customize_a")}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
