/** YouTube Shorts downloader FAQ — shared by page content and JSON-LD */

export type ShotsFaqItem = {
  question: string
  answer: string
}

export const SHOTS_FAQ_ITEMS: ShotsFaqItem[] = [
  {
    question: "Is this YouTube Shorts downloader safe?",
    answer:
      "Yes. YoutubeShortDownloader runs entirely in your browser over HTTPS. We do not require sign-up, do not ask for your Google password, and do not install software on your device.",
  },
  {
    question: "Can I download Shorts on iPhone?",
    answer:
      "Yes. Open Safari (or Chrome) on your iPhone, paste the Shorts link, tap Get Video, then Download MP4. The file saves to your device like any other browser download.",
  },
  {
    question: "Is the Shorts downloader free?",
    answer:
      "Yes — 100% free. There is no subscription, hidden fee, or account required to save YouTube Shorts as MP4.",
  },
  {
    question: "What video quality is supported?",
    answer:
      "YoutubeShortDownloader supports MP4 downloads from 144p through 1080p HD, including 360p, 480p, and 720p — choose the quality that fits your storage and editing needs.",
  },
  {
    question: "Do I need to install software?",
    answer:
      "No. This is a browser-based online Shorts saver. Paste a link on phone, tablet, or desktop — no app store download needed.",
  },
  {
    question: "Why is my Shorts video not downloading?",
    answer:
      "Common causes: an invalid or private URL, network interruption, or the video being region-restricted. Double-check the link format (youtube.com/shorts/…), refresh, and try again. For regular videos, use our YouTube video downloader.",
  },
  {
    question: "Can I save Shorts without watermark?",
    answer:
      "Yes. Downloads are direct MP4 files from the source stream — no extra watermark is added by YoutubeShortDownloader.",
  },
  {
    question: "What URL formats are supported?",
    answer:
      "Supports youtube.com/shorts/VIDEO_ID, youtu.be/VIDEO_ID, and youtube.com/watch?v=VIDEO_ID links.",
  },
]

export const SHOTS_LAST_MODIFIED = "2026-05-24"
export const SHOTS_LAST_MODIFIED_ISO = `${SHOTS_LAST_MODIFIED}T12:00:00.000Z`

export function generateShotsFAQSchema(baseUrl: string) {
  return {
    "@type": "FAQPage",
    "@id": `${baseUrl}#faq`,
    mainEntity: SHOTS_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function generateShotsHowToSchema(baseUrl: string) {
  return {
    "@type": "HowTo",
    "@id": `${baseUrl}#howto`,
    name: "How to Download YouTube Shorts",
    description:
      "Download any YouTube Short as an HD MP4 file using YoutubeShortDownloader in three steps — copy, paste, download.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the Shorts URL",
        text: "Open the Short on YouTube and copy the share link from the app or browser.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste the link",
        text: "Paste the URL into YoutubeShortDownloader and click Get Video to load available qualities.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download HD MP4 instantly",
        text: "Select quality up to 1080p and click Download MP4 to save the file to your device.",
      },
    ],
  }
}
