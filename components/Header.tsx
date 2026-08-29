"use client"

import siteMetadata from "@/data/siteMetadata"
import headerNavLinks from "@/data/headerNavLinks"
import Link from "./Link"
import Image from "./Image"
import LanguageSelect from "./LanguageSelect"
import { useTranslations } from "next-intl"
import { Link as LocaleLink, usePathname } from "@/app/i18n/navigation"
import { getChromeSurface, normalizeChromePath } from "@/lib/chrome/surface"
import AccountMenu from "./chrome/AccountMenu"
import MobileDock from "./chrome/MobileDock"

interface HeaderProps {
  authEnabled?: boolean
}

const navLinkClass = (active: boolean) =>
  `relative inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none ${
    active
      ? "text-white after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-pink-400"
      : "text-slate-300 hover:text-white"
  }`

function isCurrentPath(pathname: string, href: string) {
  return normalizeChromePath(pathname) === normalizeChromePath(href)
}

function BrandLink() {
  return (
    <Link
      href="/"
      aria-label={siteMetadata.headerTitle}
      className="inline-flex min-h-11 min-w-0 items-center gap-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
    >
      <Image
        src="/static/logos.png"
        alt="geekskai Logo"
        width={44}
        height={36}
        loading="eager"
        sizes="44px"
        className="h-8 w-10 shrink-0 sm:h-9 sm:w-11"
      />
      <span className="truncate text-base font-bold text-white sm:text-xl">
        {siteMetadata.headerTitle}
      </span>
    </Link>
  )
}

function AuthHeader() {
  return (
    <header
      data-chrome-surface="auth"
      className="sticky top-0 z-80 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 2xl:px-0">
        <BrandLink />
        <LocaleLink
          href="/tools/"
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg px-2.5 text-sm font-semibold text-slate-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 sm:px-3"
        >
          <span className="sm:hidden">Tools</span>
          <span className="hidden sm:inline">Back to tools</span>
        </LocaleLink>
      </div>
    </header>
  )
}

function WorkspaceHeader() {
  const pathname = usePathname()

  return (
    <>
      <header
        data-chrome-surface="workspace"
        className="sticky top-0 z-80 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 2xl:px-0">
          <BrandLink />
          <div className="hidden items-center gap-6 lg:flex">
            <nav className="flex items-center" aria-label="Audio Toolkit">
              <LocaleLink
                href="/audio-toolkit/"
                aria-current={isCurrentPath(pathname, "/audio-toolkit/") ? "page" : undefined}
                className={navLinkClass(isCurrentPath(pathname, "/audio-toolkit/"))}
              >
                Audio Toolkit
              </LocaleLink>
              <LocaleLink
                href="/tools/"
                className={navLinkClass(isCurrentPath(pathname, "/tools/"))}
              >
                All tools
              </LocaleLink>
            </nav>
            <AccountMenu />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <LocaleLink
              href="/tools/"
              className="inline-flex min-h-11 items-center rounded-lg border border-slate-600 bg-slate-800 px-2.5 text-sm font-semibold text-white hover:border-slate-400 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              All tools
            </LocaleLink>
            <AccountMenu compact />
          </div>
        </div>
      </header>
      <MobileDock surface="workspace" />
    </>
  )
}

function AcquisitionHeader() {
  const t = useTranslations("HomePage")
  const pathname = usePathname()

  return (
    <>
      <header
        data-chrome-surface="acquisition"
        className="sticky top-0 z-80 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 2xl:px-0">
          <BrandLink />
          <div className="hidden items-center gap-6 lg:flex">
            <nav className="flex items-center" aria-label="Primary">
              {headerNavLinks.map((link) => {
                const active = isCurrentPath(pathname, link.href)
                return (
                  <LocaleLink
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={navLinkClass(active)}
                  >
                    {t(link.title)}
                  </LocaleLink>
                )
              })}
            </nav>
            <LanguageSelect />
            <AccountMenu />
          </div>
          <div className="flex shrink-0 items-center gap-1.5 lg:hidden">
            <LanguageSelect compact />
            <AccountMenu compact />
          </div>
        </div>
      </header>
      <MobileDock surface="acquisition" />
    </>
  )
}

const Header = (_props: HeaderProps) => {
  const pathname = usePathname()
  const surface = getChromeSurface(pathname)

  if (surface === "auth") return <AuthHeader />
  if (surface === "workspace") return <WorkspaceHeader />
  return <AcquisitionHeader />
}

export default Header
