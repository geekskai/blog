"use client"

import { Link } from "@/app/i18n/navigation"
import {
  soundCloudHubPath,
  soundCloudToolLinks,
  type SoundCloudToolKey,
} from "@/data/soundCloudGrowth"
import {
  Download,
  FileAudio,
  ImageIcon,
  Layers3,
  ListMusic,
  Music2,
  ArrowRight,
} from "lucide-react"
import { useLocale } from "next-intl"
import type { ElementType } from "react"

type SoundCloudToolSwitcherProps = {
  current: SoundCloudToolKey
  showHeader?: boolean
}

type ToolCopy = {
  label: string
  intent: string
  cta: string
}

type SwitcherCopy = {
  eyebrow: string
  title: string
  description: string
  hubLabel: string
  tools: Record<SoundCloudToolKey, ToolCopy>
}

const iconMap: Record<SoundCloudToolKey, ElementType> = {
  hub: Layers3,
  downloader: Download,
  mp3: Music2,
  wav: FileAudio,
  playlist: ListMusic,
  artwork: ImageIcon,
}

const copyByLocale: Record<string, SwitcherCopy> = {
  en: {
    eyebrow: "SoundCloud toolkit",
    title: "Choose the right SoundCloud workflow",
    description:
      "Move between MP3, M4A, and converted WAV track downloads, playlists, and artwork without starting a new search.",
    hubLabel: "View all SoundCloud tools",
    tools: {
      hub: {
        label: "SoundCloud tools",
        intent: "All supported SoundCloud download workflows in one place.",
        cta: "Open hub",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Best for one input that may be a single track or playlist.",
        cta: "Use downloader",
      },
      mp3: {
        label: "SoundCloud to MP3",
        intent: "Prefers progressive MP3 and keeps M4A when that is the available stream.",
        cta: "Check MP3",
      },
      wav: {
        label: "SoundCloud to WAV",
        intent: "Prepares a PCM WAV from the available MP3 or AAC/M4A source without restoring lost audio detail.",
        cta: "Prepare WAV",
      },
      playlist: {
        label: "Playlist Downloader",
        intent: "Best for full sets, albums, and multi-track SoundCloud URLs.",
        cta: "Download playlist",
      },
      artwork: {
        label: "Artwork Downloader",
        intent: "Best when you only need the track or playlist cover image.",
        cta: "Get artwork",
      },
    },
  },
  fr: {
    eyebrow: "Outils SoundCloud",
    title: "Choisissez le bon flux SoundCloud",
    description:
      "Passez des téléchargements MP3, M4A ou WAV converti aux playlists et pochettes sans refaire une recherche.",
    hubLabel: "Voir tous les outils SoundCloud",
    tools: {
      hub: {
        label: "Outils SoundCloud",
        intent: "Tous les flux de telechargement SoundCloud pris en charge au meme endroit.",
        cta: "Ouvrir le hub",
      },
      downloader: {
        label: "Telechargeur SoundCloud",
        intent: "Ideal pour une URL qui peut etre une piste ou une playlist.",
        cta: "Utiliser",
      },
      mp3: {
        label: "SoundCloud vers MP3",
        intent: "Priorise le MP3 progressif et conserve M4A lorsque c'est le flux disponible.",
        cta: "Verifier le MP3",
      },
      wav: {
        label: "SoundCloud vers WAV",
        intent: "Prépare un WAV PCM depuis la source MP3 ou AAC/M4A disponible, sans restaurer les détails audio perdus.",
        cta: "Préparer WAV",
      },
      playlist: {
        label: "Telechargeur de playlists",
        intent: "Ideal pour sets, albums et URL SoundCloud multi-pistes.",
        cta: "Telecharger",
      },
      artwork: {
        label: "Telechargeur de pochettes",
        intent: "Ideal si vous avez seulement besoin de l'image de couverture.",
        cta: "Obtenir l'image",
      },
    },
  },
  es: {
    eyebrow: "Herramientas SoundCloud",
    title: "Elige el flujo correcto de SoundCloud",
    description:
      "Cambia entre descargas MP3, M4A o WAV convertido, playlists y carátulas sin empezar otra búsqueda.",
    hubLabel: "Ver todas las herramientas SoundCloud",
    tools: {
      hub: {
        label: "Herramientas SoundCloud",
        intent: "Flujos de descarga SoundCloud compatibles en un solo lugar.",
        cta: "Abrir hub",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Para una URL que puede ser pista individual o playlist.",
        cta: "Usar",
      },
      mp3: {
        label: "SoundCloud a MP3",
        intent: "Prioriza MP3 progresivo y conserva M4A cuando es el flujo disponible.",
        cta: "Comprobar MP3",
      },
      wav: {
        label: "SoundCloud a WAV",
        intent: "Prepara un WAV PCM desde la fuente MP3 o AAC/M4A disponible, sin recuperar detalles de audio perdidos.",
        cta: "Preparar WAV",
      },
      playlist: {
        label: "Playlist Downloader",
        intent: "Para sets, albumes y URLs de varias pistas.",
        cta: "Descargar playlist",
      },
      artwork: {
        label: "Artwork Downloader",
        intent: "Para descargar solo la imagen de portada.",
        cta: "Obtener portada",
      },
    },
  },
  de: {
    eyebrow: "SoundCloud Werkzeuge",
    title: "Wahle den passenden SoundCloud Workflow",
    description:
      "Wechsle zwischen MP3-, M4A- und konvertierten WAV-Downloads, Playlists und Coverbildern ohne neue Suche.",
    hubLabel: "Alle SoundCloud Tools anzeigen",
    tools: {
      hub: {
        label: "SoundCloud Tools",
        intent: "Alle unterstutzten SoundCloud Download-Ablaufe an einem Ort.",
        cta: "Hub offnen",
      },
      downloader: {
        label: "SoundCloud Downloader",
        intent: "Fur eine URL, die Track oder Playlist sein kann.",
        cta: "Downloader nutzen",
      },
      mp3: {
        label: "SoundCloud zu MP3",
        intent: "Bevorzugt progressives MP3 und behalt M4A, wenn nur dieser Stream verfugbar ist.",
        cta: "MP3 prufen",
      },
      wav: {
        label: "SoundCloud zu WAV",
        intent: "Erstellt PCM-WAV aus der verfügbaren MP3- oder AAC/M4A-Quelle, ohne verlorene Audiodetails wiederherzustellen.",
        cta: "WAV vorbereiten",
      },
      playlist: {
        label: "Playlist Downloader",
        intent: "Fur Sets, Alben und SoundCloud URLs mit mehreren Tracks.",
        cta: "Playlist laden",
      },
      artwork: {
        label: "Artwork Downloader",
        intent: "Fur Coverbilder von Tracks oder Playlists.",
        cta: "Artwork laden",
      },
    },
  },
}

const additionalCopyByLocale: Record<string, SwitcherCopy> = {
  ar: {
    eyebrow: "مجموعة أدوات SoundCloud", title: "اختر مسار SoundCloud المناسب", description: "تنقّل بين تنزيلات المقاطع بصيغ MP3 وM4A وWAV المحوّلة، وقوائم التشغيل والصور من دون بدء بحث جديد.", hubLabel: "عرض جميع أدوات SoundCloud",
    tools: { hub: { label: "أدوات SoundCloud", intent: "جميع مسارات تنزيل SoundCloud المدعومة في مكان واحد.", cta: "فتح المجموعة" }, downloader: { label: "منزّل SoundCloud", intent: "مناسب عندما قد يكون الرابط مقطعًا واحدًا أو قائمة تشغيل.", cta: "استخدام المنزّل" }, mp3: { label: "SoundCloud إلى MP3", intent: "يفضّل MP3 التدريجي ويحافظ على M4A عندما يكون هو البث المتاح.", cta: "فحص MP3" }, wav: { label: "SoundCloud إلى WAV", intent: "يجهّز WAV بصيغة PCM من مصدر MP3 أو AAC/M4A المتاح دون استعادة التفاصيل المفقودة.", cta: "تجهيز WAV" }, playlist: { label: "منزّل قوائم التشغيل", intent: "مناسب للمجموعات والألبومات وروابط SoundCloud متعددة المقاطع.", cta: "تنزيل القائمة" }, artwork: { label: "منزّل الصور", intent: "مناسب عندما تحتاج فقط إلى صورة غلاف المقطع أو القائمة.", cta: "الحصول على الصورة" } },
  },
  ja: {
    eyebrow: "SoundCloud ツールキット", title: "目的に合う SoundCloud ツールを選択", description: "MP3、M4A、変換した WAV のトラック、プレイリスト、アートワークを新しい検索なしで切り替えられます。", hubLabel: "SoundCloud ツールをすべて表示",
    tools: { hub: { label: "SoundCloud ツール", intent: "対応している SoundCloud のダウンロード方法をまとめて確認できます。", cta: "ハブを開く" }, downloader: { label: "SoundCloud ダウンローダー", intent: "URL がトラックかプレイリストか分からない場合に適しています。", cta: "ダウンローダーを使用" }, mp3: { label: "SoundCloud to MP3", intent: "プログレッシブ MP3 を優先し、利用可能なストリームが M4A の場合は M4A を保持します。", cta: "MP3 を確認" }, wav: { label: "SoundCloud to WAV", intent: "利用可能な MP3 または AAC/M4A ソースから PCM WAV を準備します。失われた音声の詳細は復元しません。", cta: "WAV を準備" }, playlist: { label: "プレイリストダウンローダー", intent: "セット、アルバム、複数トラックの SoundCloud URL に適しています。", cta: "プレイリストをダウンロード" }, artwork: { label: "アートワークダウンローダー", intent: "トラックやプレイリストのカバー画像だけが必要な場合に適しています。", cta: "アートワークを取得" } },
  },
  ko: {
    eyebrow: "SoundCloud 도구 모음", title: "알맞은 SoundCloud 도구 선택", description: "새로 검색하지 않고 MP3, M4A, 변환된 WAV 트랙 다운로드와 플레이리스트 및 아트워크 도구 사이를 이동하세요.", hubLabel: "모든 SoundCloud 도구 보기",
    tools: { hub: { label: "SoundCloud 도구", intent: "지원되는 모든 SoundCloud 다운로드 흐름을 한곳에서 확인합니다.", cta: "허브 열기" }, downloader: { label: "SoundCloud 다운로더", intent: "URL이 단일 트랙인지 플레이리스트인지 모를 때 적합합니다.", cta: "다운로더 사용" }, mp3: { label: "SoundCloud to MP3", intent: "프로그레시브 MP3를 우선하고 가능한 스트림이 M4A이면 M4A를 유지합니다.", cta: "MP3 확인" }, wav: { label: "SoundCloud to WAV", intent: "사용 가능한 MP3 또는 AAC/M4A 소스에서 PCM WAV를 준비하며 손실된 음질을 복원하지 않습니다.", cta: "WAV 준비" }, playlist: { label: "플레이리스트 다운로더", intent: "세트, 앨범, 여러 트랙이 포함된 SoundCloud URL에 적합합니다.", cta: "플레이리스트 다운로드" }, artwork: { label: "아트워크 다운로더", intent: "트랙이나 플레이리스트의 커버 이미지만 필요할 때 적합합니다.", cta: "아트워크 받기" } },
  },
  no: {
    eyebrow: "SoundCloud-verktøy", title: "Velg riktig SoundCloud-verktøy", description: "Bytt mellom MP3-, M4A- og konverterte WAV-nedlastinger, spillelister og artwork uten å starte et nytt søk.", hubLabel: "Se alle SoundCloud-verktøy",
    tools: { hub: { label: "SoundCloud-verktøy", intent: "Alle støttede SoundCloud-nedlastinger samlet på ett sted.", cta: "Åpne oversikten" }, downloader: { label: "SoundCloud-nedlaster", intent: "Best når URL-en kan være et enkelt spor eller en spilleliste.", cta: "Bruk nedlasteren" }, mp3: { label: "SoundCloud til MP3", intent: "Foretrekker progressiv MP3 og beholder M4A når det er den tilgjengelige strømmen.", cta: "Sjekk MP3" }, wav: { label: "SoundCloud til WAV", intent: "Klargjør PCM WAV fra tilgjengelig MP3- eller AAC/M4A-kilde uten å gjenopprette tapte detaljer.", cta: "Klargjør WAV" }, playlist: { label: "Spillelistedownloader", intent: "Best for sett, album og SoundCloud-URL-er med flere spor.", cta: "Last ned spilleliste" }, artwork: { label: "Artwork-nedlaster", intent: "Best når du bare trenger coverbildet til et spor eller en spilleliste.", cta: "Hent artwork" } },
  },
  "zh-cn": {
    eyebrow: "SoundCloud 工具集", title: "选择合适的 SoundCloud 工具", description: "无需重新搜索，即可在 MP3、M4A、转换后的 WAV 曲目下载，以及播放列表和封面工具之间切换。", hubLabel: "查看全部 SoundCloud 工具",
    tools: { hub: { label: "SoundCloud 工具", intent: "在一个页面查看所有支持的 SoundCloud 下载流程。", cta: "打开工具集" }, downloader: { label: "SoundCloud 下载器", intent: "适合不确定 URL 是单曲还是播放列表的情况。", cta: "使用下载器" }, mp3: { label: "SoundCloud 转 MP3", intent: "优先使用渐进式 MP3；可用流只有 M4A 时则保留真实的 M4A 格式。", cta: "检查 MP3" }, wav: { label: "SoundCloud 转 WAV", intent: "从可用的 MP3 或 AAC/M4A 源准备 PCM WAV，不会恢复已丢失的音频细节。", cta: "准备 WAV" }, playlist: { label: "播放列表下载器", intent: "适合完整歌单、专辑和包含多个曲目的 SoundCloud URL。", cta: "下载播放列表" }, artwork: { label: "封面下载器", intent: "只需要曲目或播放列表封面图时使用。", cta: "获取封面" } },
  },
  da: {
    eyebrow: "SoundCloud-værktøjer", title: "Vælg det rigtige SoundCloud-værktøj", description: "Skift mellem MP3-, M4A- og konverterede WAV-downloads, playlister og artwork uden at starte en ny søgning.", hubLabel: "Se alle SoundCloud-værktøjer",
    tools: { hub: { label: "SoundCloud-værktøjer", intent: "Alle understøttede SoundCloud-downloadflows samlet ét sted.", cta: "Åbn oversigten" }, downloader: { label: "SoundCloud-downloader", intent: "Bedst når URL’en kan være et enkelt nummer eller en playliste.", cta: "Brug downloader" }, mp3: { label: "SoundCloud til MP3", intent: "Prioriterer progressiv MP3 og beholder M4A, når det er den tilgængelige stream.", cta: "Tjek MP3" }, wav: { label: "SoundCloud til WAV", intent: "Forbereder PCM WAV fra den tilgængelige MP3- eller AAC/M4A-kilde uden at genskabe tabte detaljer.", cta: "Forbered WAV" }, playlist: { label: "Playlist-downloader", intent: "Bedst til sæt, albummer og SoundCloud-URL’er med flere numre.", cta: "Download playliste" }, artwork: { label: "Artwork-downloader", intent: "Bedst når du kun har brug for coverbilledet til et nummer eller en playliste.", cta: "Hent artwork" } },
  },
}

export default function SoundCloudToolSwitcher({
  current,
  showHeader = true,
}: SoundCloudToolSwitcherProps) {
  const locale = useLocale()
  const copy = additionalCopyByLocale[locale] || copyByLocale[locale] || copyByLocale.en

  return (
    <section
      className={`mx-auto max-w-7xl rounded-2xl border border-sky-500/20 bg-slate-950/55 p-4 shadow-[0_24px_80px_-48px_rgba(14,165,233,0.45)] md:p-5 ${
        showHeader ? "" : "border-slate-800/90"
      }`}
    >
      {showHeader ? (
        <>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300 sm:text-xs">
                {copy.eyebrow}
              </p>
              <h2 className="mt-2 text-[clamp(1.25rem,2.8vw,1.75rem)] font-bold leading-tight tracking-[-0.03em] text-white">
                {copy.title}
              </h2>
            </div>
            <Link
              href={soundCloudHubPath}
              prefetch={false}
              className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-sky-300 underline-offset-4 transition-colors hover:text-sky-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {copy.hubLabel}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <p className="mb-5 text-sm leading-6 text-slate-300 md:text-base">{copy.description}</p>
        </>
      ) : (
        <div
          className="pointer-events-none mb-4 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"
          aria-hidden
        />
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {soundCloudToolLinks.map((tool) => {
          const toolCopy = copy.tools[tool.key]
          const Icon = iconMap[tool.key]
          const isCurrent = current === tool.key

          return (
            <Link
              key={tool.key}
              href={tool.href}
              prefetch={false}
              aria-current={isCurrent ? "page" : undefined}
              className={`group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl border p-4 transition-[border-color,background-color,box-shadow] duration-200 motion-reduce:transition-none ${
                isCurrent
                  ? "border-sky-400/55 bg-sky-500/15 shadow-[0_12px_40px_-24px_rgba(14,165,233,0.55)]"
                  : "border-slate-800/90 bg-slate-900/45 hover:border-sky-400/35 hover:bg-sky-500/10"
              }`}
            >
              {!isCurrent ? (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                  aria-hidden
                />
              ) : (
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent"
                  aria-hidden
                />
              )}
              <div className="mb-3 flex items-start gap-2.5">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isCurrent
                      ? "border-sky-400/30 bg-sky-500/15 text-sky-200"
                      : "border-slate-700/80 bg-slate-950/70 text-slate-300 group-hover:border-sky-400/25 group-hover:text-sky-300"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="pt-0.5 text-sm font-bold leading-snug text-white">
                  {toolCopy.label}
                </span>
              </div>
              <span className="flex-1 text-xs leading-5 text-slate-300 group-hover:text-slate-200">
                {toolCopy.intent}
              </span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 group-hover:text-sky-200">
                {toolCopy.cta}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden
                />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
