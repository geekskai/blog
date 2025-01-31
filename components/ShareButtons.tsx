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
} from 'react-share'
import siteMetadata from '@/data/siteMetadata'

const shareUrl = typeof window !== 'undefined' ? window.location?.href : siteMetadata.siteUrl

const ReactShare = [
  <FacebookShareButton key="facebook" url={shareUrl} title={document.title}>
    <FacebookIcon size={32} round />
  </FacebookShareButton>,
  <LinkedinShareButton
    key="linkedin"
    url={shareUrl}
    summary={siteMetadata.description}
    source={siteMetadata.siteUrl}
    title={document.title}
  >
    <LinkedinIcon size={32} round />
  </LinkedinShareButton>,
  <RedditShareButton key="reddit" url={shareUrl} title={document.title}>
    <RedditIcon size={32} round />
  </RedditShareButton>,
  <TelegramShareButton key="telegram" title={document.title} url={shareUrl}>
    <TelegramIcon size={32} round />
  </TelegramShareButton>,
  <EmailShareButton
    key="email"
    title={document.title}
    url={shareUrl}
    subject={siteMetadata.title}
    body="body"
  >
    <EmailIcon size={32} round />
  </EmailShareButton>,
  <TwitterShareButton key="twitter" url={shareUrl} title={document.title}>
    <TwitterIcon size={32} round />
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
