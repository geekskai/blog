/** YouTube Audio Downloader page FAQ — shared by AudioMain and JSON-LD */

export type AudioFaqItem = {
  question: string
  answer: string
}

export const AUDIO_FAQ_ITEMS: AudioFaqItem[] = [
  {
    question: "How do I download audio from a YouTube video?",
    answer:
      "Paste your YouTube video URL into the downloader, click Get Audio, then Download. The audio file saves to your device in seconds with no account required.",
  },
  {
    question: "Is this YouTube to MP3 downloader free?",
    answer:
      "Yes — it is completely free. There is no sign-up, subscription, or software install required.",
  },
  {
    question: "What URL formats are supported?",
    answer:
      "Supports youtube.com/watch?v=VIDEO_ID, youtu.be/VIDEO_ID, youtube.com/embed/VIDEO_ID, and youtube.com/shorts/VIDEO_ID links.",
  },
  {
    question: "Can I download YouTube audio on mobile?",
    answer:
      "Yes. The downloader is mobile-first: paste a link in your phone browser, choose audio quality, and save the file locally.",
  },
]

export const AUDIO_LAST_MODIFIED = "2026-05-24"

export function generateAudioFAQSchema(baseUrl: string) {
  return {
    "@type": "FAQPage",
    "@id": `${baseUrl}#faq`,
    mainEntity: AUDIO_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function generateAudioHowToSchema(baseUrl: string) {
  return {
    "@type": "HowTo",
    "@id": `${baseUrl}#howto`,
    name: "How to download YouTube audio",
    description:
      "Extract audio from any public YouTube video using the browser-based downloader in three steps.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the video link",
        text: "Open the video on YouTube and copy the share link from the app or browser.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste and fetch audio",
        text: "Paste the URL into the downloader and click Get Audio to load available bitrates.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Download audio",
        text: "Select your preferred quality and click Download to save the audio file.",
      },
    ],
  }
}
