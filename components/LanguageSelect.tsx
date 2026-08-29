"use client"
import { usePathname, useRouter } from "../app/i18n/navigation"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Languages } from "lucide-react"
import { useLocale } from "next-intl"
import React from "react"
import { locales } from "../app/i18n/routing"

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
    value: "ar",
    label: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    hreflang: "ar-SA",
    region: "Saudi Arabia",
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
  {
    value: "zh-cn",
    label: "Chinese (Simplified)",
    nativeName: "中文简体",
    flag: "🇨🇳",
    hreflang: "zh-CN",
    region: "China",
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
  return languageOptions.filter((lang) => locales.includes(lang.value))
}

// Export for SEO hreflang generation
export const getHreflangData = () => {
  return getSupportedLanguages().map((lang) => ({
    hreflang: lang.hreflang,
    href: `/${lang.value === "en" ? "" : lang.value}`,
  }))
}

export default function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
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
        triggerRef.current?.focus()
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

  const moveOptionFocus = (event: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % supportedLanguages.length
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + supportedLanguages.length) % supportedLanguages.length
    } else if (event.key === "Home") {
      nextIndex = 0
    } else if (event.key === "End") {
      nextIndex = supportedLanguages.length - 1
    } else {
      return
    }
    event.preventDefault()
    optionRefs.current[nextIndex]?.focus()
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div
        className={
          compact
            ? "h-11 w-11 animate-pulse rounded-lg bg-slate-700/50"
            : "h-8 w-20 animate-pulse rounded-lg bg-slate-700/50"
        }
      />
    )
  }

  return isHiddenSwitchLang ? null : (
    <div className="relative w-auto" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            if (!isOpen) setIsOpen(true)
            window.requestAnimationFrame(() => {
              const selectedIndex = supportedLanguages.findIndex(
                (option) => option.value === currentLocale
              )
              optionRefs.current[Math.max(selectedIndex, 0)]?.focus()
            })
          }
        }}
        className={
          compact
            ? "group relative z-80 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-slate-700/70 bg-slate-800/50 text-slate-300 transition-[color,background-color,border-color] duration-200 hover:border-slate-500 hover:bg-slate-700/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none"
            : "group relative z-80 flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-slate-700/70 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 transition-[color,background-color,border-color] duration-200 hover:border-slate-500 hover:bg-slate-700/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="language-options"
        aria-label="Select language"
      >
        <Languages className="h-4 w-4" aria-hidden />
        {compact ? null : <span>{currentLanguage?.nativeName}</span>}
        {compact ? null : (
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 motion-reduce:transform-none motion-reduce:transition-none ${
              isOpen ? "rotate-180 text-blue-400" : "group-hover:text-blue-400"
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full z-80 mt-2 w-64 transform transition-all duration-300 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
          {/* Options List */}
          <div id="language-options" className="grid grid-cols-2 gap-2 px-4 py-3" role="listbox">
            {supportedLanguages.map((option, index) => {
              const isSelected = option.value === currentLocale
              return (
                <button
                  key={index}
                  ref={(button) => {
                    optionRefs.current[index] = button
                  }}
                  type="button"
                  onClick={() => handleLanguageChange(option.value)}
                  onKeyDown={(event) => moveOptionFocus(event, index)}
                  tabIndex={isSelected ? 0 : -1}
                  className={`group flex min-h-11 w-full cursor-pointer items-center justify-between gap-1 rounded-md px-2 py-2 text-left transition-[color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 motion-reduce:transition-none ${
                    isSelected
                      ? "bg-blue-500/20 text-blue-300"
                      : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`${option.nativeName} (${option.label})`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-base font-medium">{option.nativeName}</span>
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
