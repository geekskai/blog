"use client"
import { Link } from "@/app/i18n/navigation"
import { getToolLinkLocale } from "@/app/sitemap-config"
import { useLocale } from "next-intl"
import NextLink from "next/link"
import type { ComponentProps } from "react"
import { AnchorHTMLAttributes } from "react"

type LinkProps = ComponentProps<typeof Link>

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const currentLocale = useLocale()
  if (typeof href === "string" && href.startsWith("/")) {
    const canonicalLocale = getToolLinkLocale(href, currentLocale)
    if (canonicalLocale) {
      return <NextLink className="break-words" href={href} {...rest} />
    }
    return <Link className="break-words" href={href} {...rest} />
  }

  if (typeof href === "string" && href.startsWith("#")) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink
