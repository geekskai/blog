"use client"
import { usePathname, useRouter } from "../app/i18n/navigation"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { useLocale } from "next-intl"
import { supportedLocales } from "../app/i18n/routing"

interface LanguageOption {
  value: string
  label: string
  nativeName: string
  flag: string
  hreflang: string
  region?: string
}

const languageOptions: LanguageOption[] = [
  {
    value: "en",
    label: "English",
    nativeName: "English",
    flag: "🇺🇸",
    hreflang: "en-US",
    region: "United States",
  },
  {
    value: "zh-cn",
    label: "Chinese (Simplified)",
    nativeName: "中文（简体）",
    flag: "🇨🇳",
    hreflang: "zh-CN",
    region: "China",
  },
  // {
  //   value: "zh-tw",
  //   label: "Chinese (Traditional)",
  //   nativeName: "中文（繁體）",
  //   flag: "🇨🇳",
  //   hreflang: "zh-TW",
  //   region: "Taiwan",
  // },
  // {
  //   value: "zh-hk",
  //   label: "Chinese (Hong Kong)",
  //   nativeName: "中文（香港）",
  //   flag: "🇨🇳",
  //   hreflang: "zh-HK",
  //   region: "Hong Kong",
  // },
  // Additional major languages for international SEO
  {
    value: "es",
    label: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    hreflang: "es-ES",
    region: "Spain",
  },
  {
    value: "fr",
    label: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    hreflang: "fr-FR",
    region: "France",
  },
  {
    value: "de",
    label: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    hreflang: "de-DE",
    region: "Germany",
  },
  {
    value: "ja",
    label: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    hreflang: "ja-JP",
    region: "Japan",
  },
  {
    value: "ko",
    label: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    hreflang: "ko-KR",
    region: "South Korea",
  },
  {
    value: "pt",
    label: "Portuguese",
    nativeName: "Português",
    flag: "🇧🇷",
    hreflang: "pt-BR",
    region: "Brazil",
  },
  {
    value: "ru",
    label: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    hreflang: "ru-RU",
    region: "Russia",
  },
  {
    value: "ar",
    label: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    hreflang: "ar-SA",
    region: "Saudi Arabia",
  },
  {
    value: "hi",
    label: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    hreflang: "hi-IN",
    region: "India",
  },
  {
    value: "it",
    label: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    hreflang: "it-IT",
    region: "Italy",
  },
  {
    value: "nl",
    label: "Dutch",
    nativeName: "Nederlands",
    flag: "🇳🇱",
    hreflang: "nl-NL",
    region: "Netherlands",
  },
  {
    value: "sv",
    label: "Swedish",
    nativeName: "Svenska",
    flag: "🇸🇪",
    hreflang: "sv-SE",
    region: "Sweden",
  },
  {
    value: "pl",
    label: "Polish",
    nativeName: "Polski",
    flag: "🇵🇱",
    hreflang: "pl-PL",
    region: "Poland",
  },
  {
    value: "tr",
    label: "Turkish",
    nativeName: "Türkçe",
    flag: "🇹🇷",
    hreflang: "tr-TR",
    region: "Turkey",
  },
  {
    value: "th",
    label: "Thai",
    nativeName: "ไทย",
    flag: "🇹🇭",
    hreflang: "th-TH",
    region: "Thailand",
  },
  {
    value: "vi",
    label: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
    hreflang: "vi-VN",
    region: "Vietnam",
  },
  {
    value: "id",
    label: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    hreflang: "id-ID",
    region: "Indonesia",
  },
  {
    value: "ms",
    label: "Malay",
    nativeName: "Bahasa Melayu",
    flag: "🇲🇾",
    hreflang: "ms-MY",
    region: "Malaysia",
  },
  // Nordic Languages
  {
    value: "no",
    label: "Norwegian",
    nativeName: "Norsk",
    flag: "🇳🇴",
    hreflang: "no-NO",
    region: "Norway",
  },
  {
    value: "da",
    label: "Danish",
    nativeName: "Dansk",
    flag: "🇩🇰",
    hreflang: "da-DK",
    region: "Denmark",
  },
  {
    value: "fi",
    label: "Finnish",
    nativeName: "Suomi",
    flag: "🇫🇮",
    hreflang: "fi-FI",
    region: "Finland",
  },
  {
    value: "is",
    label: "Icelandic",
    nativeName: "Íslenska",
    flag: "🇮🇸",
    hreflang: "is-IS",
    region: "Iceland",
  },
  // Additional European Languages
  {
    value: "cs",
    label: "Czech",
    nativeName: "Čeština",
    flag: "🇨🇿",
    hreflang: "cs-CZ",
    region: "Czech Republic",
  },
  {
    value: "sk",
    label: "Slovak",
    nativeName: "Slovenčina",
    flag: "🇸🇰",
    hreflang: "sk-SK",
    region: "Slovakia",
  },
  {
    value: "hu",
    label: "Hungarian",
    nativeName: "Magyar",
    flag: "🇭🇺",
    hreflang: "hu-HU",
    region: "Hungary",
  },
  {
    value: "ro",
    label: "Romanian",
    nativeName: "Română",
    flag: "🇷🇴",
    hreflang: "ro-RO",
    region: "Romania",
  },
  {
    value: "bg",
    label: "Bulgarian",
    nativeName: "Български",
    flag: "🇧🇬",
    hreflang: "bg-BG",
    region: "Bulgaria",
  },
  {
    value: "hr",
    label: "Croatian",
    nativeName: "Hrvatski",
    flag: "🇭🇷",
    hreflang: "hr-HR",
    region: "Croatia",
  },
  {
    value: "sr",
    label: "Serbian",
    nativeName: "Српски",
    flag: "🇷🇸",
    hreflang: "sr-RS",
    region: "Serbia",
  },
  {
    value: "sl",
    label: "Slovenian",
    nativeName: "Slovenščina",
    flag: "🇸🇮",
    hreflang: "sl-SI",
    region: "Slovenia",
  },
  // Baltic Languages
  {
    value: "lv",
    label: "Latvian",
    nativeName: "Latviešu",
    flag: "🇱🇻",
    hreflang: "lv-LV",
    region: "Latvia",
  },
  {
    value: "lt",
    label: "Lithuanian",
    nativeName: "Lietuvių",
    flag: "🇱🇹",
    hreflang: "lt-LT",
    region: "Lithuania",
  },
  {
    value: "et",
    label: "Estonian",
    nativeName: "Eesti",
    flag: "🇪🇪",
    hreflang: "et-EE",
    region: "Estonia",
  },
]

const hiddenSwitchLang = ["/blog/", "/privacy/", "/tags/"]

// Filter languages based on currently supported locales
// You can expand this list as you add more language support
// const supportedLocales = ["en", "zh-cn", "no", "zh-hk", "zh-tw"] // Add more as you implement them
// export const supportedLocales = ["en", "ja", "ko", "no", "zh-cn"] // Add more as you implement them
// const supportedLocales = languageOptions.map((lang) => lang.value) // Add more as you implement them

// Get only supported languages for display
export const getSupportedLanguages = () => {
  return languageOptions.filter((lang) => supportedLocales.includes(lang.value))
}

// Export for SEO hreflang generation
export const getHreflangData = () => {
  return getSupportedLanguages().map((lang) => ({
    hreflang: lang.hreflang,
    href: `/${lang.value === "en" ? "" : lang.value}`,
  }))
}

export default function LanguageSelect() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentLocale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  // const pathname = usePathname()
  // 隐藏切换语言的pathname: /blog /privacy /tags/
  const isHiddenSwitchLang = hiddenSwitchLang.some((item) => pathname.includes(item))

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleLanguageChange = (locale: string) => {
    setIsOpen(false)
    router.replace(pathname, { locale })
  }

  const supportedLanguages = getSupportedLanguages()
  const currentLanguage = supportedLanguages.find((lang) => lang.value === currentLocale)

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-700/50"></div>
  }

  return isHiddenSwitchLang ? null : (
    <div className="relative w-auto" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative z-80 flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-slate-600/50 hover:bg-slate-700/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <span className="text-base">{currentLanguage?.flag}</span>
        <span>{currentLanguage?.nativeName}</span>
        <ChevronDown
          className={`h-3 w-3 transition-all duration-300 ${
            isOpen ? "rotate-180 text-blue-400" : "group-hover:text-blue-400"
          }`}
        />

        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full z-80 mt-2 w-64 transform transition-all duration-300 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50"></div>

        <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
          {/* Options List */}
          <div className="py-2" role="listbox">
            {supportedLanguages.map((option, index) => {
              const isSelected = option.value === currentLocale
              return (
                <button
                  key={index}
                  onClick={() => handleLanguageChange(option.value)}
                  className={`group flex w-full items-center justify-between px-4 py-3 text-left transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-500/20 text-blue-300"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{option.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-base font-medium">{option.nativeName}</span>
                      <span className="text-xs text-slate-400">{option.label}</span>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected ? (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-blue-400" />
                    </div>
                  ) : (
                    <div className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
