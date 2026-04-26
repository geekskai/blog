"use client"
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
  WeiboIcon,
  WeiboShareButton,
} from "react-share"
import siteMetadata from "@/data/siteMetadata"
import React, { useEffect, useMemo, useState } from "react"

interface ShareButtonsProps {
  url?: string
  title?: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [runtimeShareUrl, setRuntimeShareUrl] = useState(url || siteMetadata.siteUrl)
  const [runtimeTitle, setRuntimeTitle] = useState(title || siteMetadata.title)

  useEffect(() => {
    if (url) {
      setRuntimeShareUrl(url)
    } else {
      setRuntimeShareUrl(window.location.href)
    }

    if (title) {
      setRuntimeTitle(title)
    } else {
      setRuntimeTitle(document.title || siteMetadata.title)
    }
  }, [title, url])

  const shareButtons = useMemo(
    () => [
      <FacebookShareButton key="facebook" url={runtimeShareUrl} title={runtimeTitle}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>,
      <WhatsappShareButton key="WhatsApp" url={runtimeShareUrl} title={runtimeTitle} separator=":: ">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>,
      <LinkedinShareButton
        key="linkedin"
        url={runtimeShareUrl}
        summary={siteMetadata.description}
        source={siteMetadata.siteUrl}
        title={runtimeTitle}
      >
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>,
      <RedditShareButton key="reddit" url={runtimeShareUrl} title={runtimeTitle}>
        <RedditIcon size={32} round />
      </RedditShareButton>,
      <TelegramShareButton key="telegram" title={runtimeTitle} url={runtimeShareUrl}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>,
      <TwitterShareButton key="twitter" url={runtimeShareUrl} title={runtimeTitle}>
        <XIcon size={32} round />
      </TwitterShareButton>,
      <WeiboShareButton key="weibo" url={runtimeShareUrl} title={runtimeTitle}>
        <WeiboIcon size={32} round />
      </WeiboShareButton>,
    ],
    [runtimeShareUrl, runtimeTitle]
  )

  return (
    <ul className="my-2 flex min-h-[52px] flex-wrap items-center justify-center gap-2 md:my-4 md:gap-3 lg:gap-4 xl:flex-row">
      {shareButtons.map((shareButton, index) => (
        <li className="flex items-center space-x-2" key={index}>
          {shareButton}
        </li>
      ))}
    </ul>
  )
}
