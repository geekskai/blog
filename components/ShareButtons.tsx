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

const shareUrl = typeof window !== "undefined" ? window.location?.href : siteMetadata.siteUrl

const title = typeof document !== "undefined" ? document.title : siteMetadata.title

const ReactShare = [
  <FacebookShareButton key="facebook" url={shareUrl} title={title}>
    <FacebookIcon size={32} round />
  </FacebookShareButton>,
  <WhatsappShareButton key="WhatsApp" url={shareUrl} title={title} separator=":: ">
    <WhatsappIcon size={32} round />
  </WhatsappShareButton>,
  <LinkedinShareButton
    key="linkedin"
    url={shareUrl}
    summary={siteMetadata.description}
    source={siteMetadata.siteUrl}
    title={title}
  >
    <LinkedinIcon size={32} round />
  </LinkedinShareButton>,
  <RedditShareButton key="reddit" url={shareUrl} title={title}>
    <RedditIcon size={32} round />
  </RedditShareButton>,
  <TelegramShareButton key="telegram" title={title} url={shareUrl}>
    <TelegramIcon size={32} round />
  </TelegramShareButton>,
  <TwitterShareButton key="twitter" url={shareUrl} title={title}>
    <XIcon size={32} round />
  </TwitterShareButton>,
  <WeiboShareButton key="weibo" url={shareUrl} title={title}>
    <WeiboIcon size={32} round />
  </WeiboShareButton>,
]

export default function ShareButtons() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 xl:flex-row">
      {ReactShare.map((shareButton, index) => (
        <li className="flex items-center space-x-2" key={index}>
          {shareButton}
        </li>
      ))}
    </ul>
  )
}
