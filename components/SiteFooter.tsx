"use client"

import Link from "./Link"
import React from "react"
import SocialIcon from "./social-icons"
import siteMetadata from "@/data/siteMetadata"
import Image from "./Image"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import LinkNext from "next/link"
import { footerPopularTools } from "@/data/toolNavigation"
import { usePathname } from "@/app/i18n/navigation"
import { getChromeSurface } from "@/lib/chrome/surface"

function MobileDockClearance() {
  return <div className="h-[calc(4.25rem+env(safe-area-inset-bottom))] lg:hidden" aria-hidden />
}

function LegalFooter({ productLabel }: { productLabel?: string }) {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between 2xl:px-0">
        <div>
          <p className="font-semibold text-white">{productLabel ?? "Geekskai"}</p>
          {productLabel ? (
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Local browser audio processing. Files and filenames are never uploaded.
            </p>
          ) : null}
        </div>
        <nav
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
          aria-label="Product policies"
        >
          <LinkNext href="/pricing/" className="text-slate-300 hover:text-white">
            Pricing
          </LinkNext>
          <LinkNext href="/terms/" className="text-slate-300 hover:text-white">
            Terms
          </LinkNext>
          <LinkNext href="/privacy/" className="text-slate-300 hover:text-white">
            Privacy
          </LinkNext>
          <a href={`mailto:${siteMetadata.email}`} className="text-violet-300 hover:text-violet-200">
            {siteMetadata.email}
          </a>
        </nav>
      </div>
      <MobileDockClearance />
    </footer>
  )
}

const SiteFooter = () => {
  const t = useTranslations("HomePage")
  const pathname = usePathname()
  const surface = getChromeSurface(pathname)

  if (surface === "auth") return null
  if (surface === "workspace") {
    return <LegalFooter productLabel="Geekskai Audio Toolkit" />
  }

  return (
    <footer data-chrome-surface="acquisition" className="mt-20 overflow-hidden bg-slate-950">
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="group mb-6 inline-flex min-h-11 items-center gap-1">
              <Image
                src="/static/logos.png"
                alt="geekskai Logo"
                width={28}
                height={26}
                sizes="100%"
                className="h-7 w-8"
              />
              <div className="text-xl font-bold text-white">geekskai</div>
            </Link>
            <p className="text-sm text-slate-400">{t("footer_description")}</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t("footer_popular_tools")}</h3>
            <div className="space-y-2">
              {footerPopularTools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    prefetch={false}
                    className="group flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 text-slate-300 transition-colors duration-200 hover:bg-slate-800/50 hover:text-white"
                  >
                    <IconComponent className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{tool.title}</span>
                  </Link>
                )
              })}
            </div>
            <Link
              href="/tools"
              prefetch={false}
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              <span>{t("footer_view_all_tools")}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t("footer_resources")}</h3>
            <div className="space-y-1">
              {[
                { href: "/blog/", label: t("footer_blog") },
                { href: "/about/", label: t("footer_about") },
                { href: "/pricing/", label: t("footer_pricing") },
                { href: "/tags/", label: t("footer_tags") },
                { href: "/projects/", label: t("footer_projects") },
                { href: "/privacy/", label: t("footer_privacy_policy") },
                { href: "/terms/", label: t("footer_terms_of_service") },
                { href: "/terms/#section-6", label: t("footer_refund_policy") },
              ].map((item) => (
                <LinkNext
                  key={item.href}
                  href={item.href}
                  className="flex min-h-11 items-center text-slate-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
                >
                  {item.label}
                </LinkNext>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">{t("footer_connect_with_us")}</h3>
            <div className="mb-6 grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-800/50">
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
              </div>
              <div className="rounded-xl bg-slate-800/50">
                <SocialIcon kind="github" href={siteMetadata.github} size={6} />
              </div>
              <div className="rounded-xl bg-slate-800/50">
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
              </div>
              <div className="rounded-xl bg-slate-800/50">
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/50 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-400 md:flex-row">
            <div>
              © {new Date().getFullYear()}{" "}
              <Link href="/" className="font-medium text-white hover:text-blue-300">
                geekskai
              </Link>
              <span> • {t("footer_all_rights_reserved")}</span>
            </div>
          </div>
        </div>
      </div>
      <MobileDockClearance />
    </footer>
  )
}

export default SiteFooter
