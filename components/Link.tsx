"use client"
import { Link } from "@/app/i18n/navigation"
import type { ComponentProps } from "react"
import { AnchorHTMLAttributes } from "react"

type LinkProps = ComponentProps<typeof Link>

const CustomLink = ({ href, ...rest }: LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && typeof href === "string" && href.startsWith("/")
  const isAnchorLink = href && typeof href === "string" && href.startsWith("#")

  if (isInternalLink) {
    return <Link className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink
