import React from "react"
import Link from "./Link"
import SocialIcon from "./social-icons"
import siteMetadata from "@/data/siteMetadata"
import Logo from "@/data/logo.png"
import Image from "next/image"
import { FileText, Calculator, Zap, Heart, ExternalLink, ArrowLeftRight } from "lucide-react"
import { useTranslations } from "next-intl"
import LinkNext from 'next/link'


// Popular tools data for footer
const popularTools = [
  {
    id: "html-to-markdown",
    title: "HTML to Markdown",
    href: "/tools/html-to-markdown",
    icon: FileText,
    badge: "New",
  },
  {
    id: "discord-time-converter",
    title: "Discord Time Converter",
    href: "/tools/discord-time-converter",
    icon: ArrowLeftRight,
    badge: "Popular",
  },
  {
    id: "job-worth-calculator",
    title: "Job Worth Calculator",
    href: "/tools/job-worth-calculator",
    icon: Calculator,
    badge: "Popular",
  },
  {
    id: "pdf-to-markdown",
    title: "PDF to Markdown",
    href: "/tools/pdf-to-markdown",
    icon: FileText,
    badge: "Pro",
  },
]

const SiteFooter = () => {
  const t = useTranslations("HomePage")
  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-20 h-1 w-1 animate-pulse rounded-full bg-blue-400 opacity-60 delay-0"></div>
        <div className="absolute right-1/3 top-32 h-0.5 w-0.5 animate-pulse rounded-full bg-purple-400 opacity-40 delay-700"></div>
        <div className="absolute bottom-40 left-1/3 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 opacity-50 delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 h-1 w-1 animate-pulse rounded-full bg-pink-400 opacity-30 delay-500"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Link href="/" className="group inline-flex items-center gap-3">
                <Image
                  src={Logo}
                  alt="geekskai Logo"
                  width={100}
                  height={36}
                  className="h-[36px] w-[100px] transition-transform duration-300 group-hover:scale-105"
                />
                <div className="text-xl font-bold text-white">geekskai</div>
              </Link>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">{t("footer_description")}</p>
            <div className="flex items-center gap-2 rounded-full bg-slate-800/50 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">
                {t("footer_100_free_forever")}
              </span>
            </div>
          </div>

          {/* Popular Tools */}
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-lg font-semibold text-white">{t("footer_popular_tools")}</h3>
            <div className="space-y-3">
              {popularTools.map((tool) => {
                const IconComponent = tool.icon
                return (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-lg bg-slate-800/30 p-3 transition-all duration-300 hover:scale-105 hover:bg-slate-700/50"
                  >
                    <div className="flex-shrink-0 rounded-md bg-slate-700/50 p-2 transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="h-4 w-4 text-slate-300 group-hover:text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200 transition-colors duration-300 group-hover:text-white">
                          {tool.title}
                        </span>
                        <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                          {tool.badge}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-slate-500 opacity-0 transition-all duration-300 group-hover:text-slate-300 group-hover:opacity-100" />
                  </Link>
                )
              })}
            </div>
            <Link
              href="/tools"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors duration-300 hover:text-blue-300"
            >
              <span>{t("footer_view_all_tools")}</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          {/* Resources */}
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-lg font-semibold text-white">{t("footer_resources")}</h3>
            <div className="space-y-3">
              <LinkNext
                href="/blog"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                <div className="h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                <span>{t("footer_blog")}</span>
              </LinkNext>
              <LinkNext
                href="/tags"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                <div className="h-1 w-1 rounded-full bg-blue-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-blue-300"></div>
                <span>{t("footer_tags")}</span>
              </LinkNext>
              <LinkNext
                href="/projects"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                <div className="h-1 w-1 rounded-full bg-purple-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-purple-300"></div>
                <span>{t("footer_projects")}</span>
              </LinkNext>
              <LinkNext
                href="/privacy"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                <div className="h-1 w-1 rounded-full bg-emerald-400 transition-all duration-300 group-hover:scale-150 group-hover:bg-emerald-300"></div>
                <span>{t("footer_privacy_policy")}</span>
              </LinkNext>
            </div>
          </div>

          {/* Connect */}
          <div className="lg:col-span-1">
            <h3 className="mb-6 text-lg font-semibold text-white">{t("footer_connect_with_us")}</h3>
            <div className="mb-6 grid grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-800/50 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-slate-700">
                <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} />
              </div>
              <div className="rounded-xl bg-slate-800/50 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-slate-700">
                <SocialIcon kind="github" href={siteMetadata.github} size={6} />
              </div>
              <div className="rounded-xl bg-slate-800/50 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-slate-700">
                <SocialIcon kind="twitter" href={siteMetadata.twitter} size={6} />
              </div>
              <div className="rounded-xl bg-slate-800/50 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-slate-700">
                <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
              </div>
            </div>
            <div className="rounded-xl border border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-slate-200">
                  {t("footer_built_with_love")}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                {t("footer_built_with_love_description")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className=" mt-16 border-t border-slate-800/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <span>© {new Date().getFullYear()}</span>
                <Link
                  href="/"
                  className="font-medium text-white transition-colors duration-300 hover:text-blue-300"
                >
                  geekskai
                </Link>
                <span>• {t("footer_all_rights_reserved")}</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <span>{t("footer_status_all_systems_operational")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
