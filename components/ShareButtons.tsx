'use client'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  XIcon,
} from 'react-share'
import siteMetadata from '@/data/siteMetadata'

const shareUrl = typeof window !== 'undefined' ? window.location?.href : siteMetadata.siteUrl

const title = typeof document !== 'undefined' ? document.title : siteMetadata.title

const ReactShare = [
  <FacebookShareButton key="facebook" url={shareUrl} title={title}>
    <FacebookIcon size={32} round />
  </FacebookShareButton>,
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
  <EmailShareButton
    key="email"
    title={title}
    url={shareUrl}
    subject={siteMetadata.title}
    body="body"
  >
    <EmailIcon size={32} round />
  </EmailShareButton>,
  <TwitterShareButton key="twitter" url={shareUrl} title={title}>
    <XIcon size={32} round />
  </TwitterShareButton>,
]

export default function ShareButtons() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-4 xl:flex-row">
      {ReactShare.map((shareButton) => (
        <li className="flex items-center space-x-2" key={shareButton.key}>
          {shareButton}
        </li>
      ))}
    </ul>
  )
}
