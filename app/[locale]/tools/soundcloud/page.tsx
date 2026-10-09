import { Link } from "@/app/i18n/navigation"
import SoundCloudToolSwitcher from "@/components/SoundCloudToolSwitcher"
import { ArrowRight, Sparkles } from "lucide-react"

const accentGradient =
  "bg-gradient-to-r from-sky-300 via-sky-400 to-cyan-400 bg-clip-text text-transparent"

const copyByLocale = {
  en: {
    eyebrow: "SoundCloud toolkit",
    titleLead: "SoundCloud tools for",
    titleAccent: "tracks, playlists, and artwork",
    intro:
      "Download accessible tracks as MP3 or M4A, or prepare a PCM WAV from the available source. Playlists run sequentially, and artwork is handled separately.",
    proofPublic: "Public tools",
    proofPublicValue: "No signup",
    proofFormats: "Formats",
    proofFormatsValue: "MP3 · M4A · WAV",
    quickEyebrow: "Quick guide",
    quickTitleLead: "Which SoundCloud tool",
    quickTitleAccent: "should I use?",
    quickItems: [
      "Use Downloader when you are not sure whether the URL is a track or playlist.",
      "Use MP3 to prefer a progressive MP3 while keeping a truthful M4A fallback.",
      "Use WAV to prepare a PCM WAV file from the available MP3 or AAC/M4A source. It does not restore lost source detail.",
      "Use Playlist when the URL contains /sets/.",
      "Use Artwork when you only need the cover image.",
    ],
    ctaPrimary: "Start with Downloader",
  },
  fr: {
    eyebrow: "Outils SoundCloud",
    titleLead: "Outils SoundCloud pour",
    titleAccent: "pistes, playlists et pochettes",
    intro:
      "Téléchargez les pistes accessibles en MP3 ou M4A, ou préparez un WAV PCM depuis la source disponible. Les playlists sont traitées en séquence et les pochettes séparément.",
    proofPublic: "Outils publics",
    proofPublicValue: "Sans inscription",
    proofFormats: "Formats",
    proofFormatsValue: "MP3 · M4A · WAV",
    quickEyebrow: "Guide rapide",
    quickTitleLead: "Quel outil SoundCloud",
    quickTitleAccent: "utiliser ?",
    quickItems: [
      "Downloader convient si vous ne savez pas si l'URL est une piste ou une playlist.",
      "MP3 priorise le flux MP3 progressif et conserve le vrai repli M4A.",
      "WAV prépare un fichier PCM depuis la source MP3 ou AAC/M4A disponible, sans restaurer les détails perdus.",
      "Playlist convient aux URL qui contiennent /sets/.",
      "Artwork convient si vous avez seulement besoin de la pochette.",
    ],
    ctaPrimary: "Commencer avec Downloader",
  },
  es: {
    eyebrow: "Herramientas SoundCloud",
    titleLead: "Herramientas SoundCloud para",
    titleAccent: "pistas, playlists y caratulas",
    intro:
      "Descarga pistas accesibles en MP3 o M4A, o prepara un WAV PCM desde la fuente disponible. Las playlists se procesan en orden y Artwork gestiona las carátulas.",
    proofPublic: "Herramientas publicas",
    proofPublicValue: "Sin registro",
    proofFormats: "Formatos",
    proofFormatsValue: "MP3 · M4A · WAV",
    quickEyebrow: "Guia rapida",
    quickTitleLead: "Que herramienta SoundCloud",
    quickTitleAccent: "usar?",
    quickItems: [
      "Downloader sirve cuando no sabes si la URL es una pista o playlist.",
      "MP3 prioriza el flujo MP3 progresivo y conserva M4A como alternativa real.",
      "WAV prepara un archivo PCM desde la fuente MP3 o AAC/M4A disponible, sin recuperar los detalles perdidos.",
      "Playlist sirve si la URL contiene /sets/.",
      "Artwork sirve si solo necesitas la caratula.",
    ],
    ctaPrimary: "Empezar con Downloader",
  },
  de: {
    eyebrow: "SoundCloud Werkzeuge",
    titleLead: "SoundCloud Tools fur",
    titleAccent: "Tracks, Playlists und Artwork",
    intro:
      "Lade zugängliche Tracks als MP3 oder M4A herunter oder bereite aus der verfügbaren Quelle eine PCM-WAV-Datei vor. Playlists laufen nacheinander, Artwork bleibt separat.",
    proofPublic: "Offentliche Tools",
    proofPublicValue: "Ohne Anmeldung",
    proofFormats: "Formate",
    proofFormatsValue: "MP3 · M4A · WAV",
    quickEyebrow: "Kurzanleitung",
    quickTitleLead: "Welches SoundCloud Tool",
    quickTitleAccent: "passt?",
    quickItems: [
      "Downloader passt, wenn unklar ist, ob die URL ein Track oder eine Playlist ist.",
      "MP3 bevorzugt progressives MP3 und behalt den echten M4A-Fallback.",
      "WAV erstellt eine PCM-Datei aus der verfügbaren MP3- oder AAC/M4A-Quelle, ohne verlorene Quelldetails wiederherzustellen.",
      "Playlist passt, wenn die URL /sets/ enthalt.",
      "Artwork passt, wenn nur das Coverbild benotigt wird.",
    ],
    ctaPrimary: "Mit Downloader starten",
  },
  ar: { eyebrow: "مجموعة أدوات SoundCloud", titleLead: "أدوات SoundCloud لـ", titleAccent: "المقاطع وقوائم التشغيل والصور", intro: "نزّل المقاطع المتاحة بصيغة MP3 أو M4A، أو جهّز WAV بصيغة PCM من المصدر المتاح. تُعالج قوائم التشغيل بالتتابع والصور بشكل منفصل.", proofPublic: "أدوات عامة", proofPublicValue: "دون تسجيل", proofFormats: "الصيغ", proofFormatsValue: "MP3 · M4A · WAV", quickEyebrow: "دليل سريع", quickTitleLead: "أي أداة SoundCloud", quickTitleAccent: "ينبغي استخدامها؟", quickItems: ["استخدم المنزّل عندما لا تعرف إن كان الرابط لمقطع أو قائمة تشغيل.", "استخدم MP3 لتفضيل MP3 التدريجي مع الحفاظ على M4A عند توفره.", "استخدم WAV لتجهيز ملف PCM من مصدر MP3 أو AAC/M4A المتاح دون استعادة التفاصيل المفقودة.", "استخدم Playlist عندما يحتوي الرابط على /sets/.", "استخدم Artwork عندما تحتاج إلى صورة الغلاف فقط."], ctaPrimary: "ابدأ بالمنزّل" },
  ja: { eyebrow: "SoundCloud ツールキット", titleLead: "SoundCloud ツールで", titleAccent: "トラック、プレイリスト、アートワークを処理", intro: "アクセス可能なトラックを MP3 または M4A でダウンロードするか、利用可能なソースから PCM WAV を準備します。プレイリストは順番に処理し、アートワークは別に扱います。", proofPublic: "公開ツール", proofPublicValue: "登録不要", proofFormats: "形式", proofFormatsValue: "MP3 · M4A · WAV", quickEyebrow: "クイックガイド", quickTitleLead: "どの SoundCloud ツールを", quickTitleAccent: "使うべき？", quickItems: ["URL がトラックかプレイリストか分からない場合は Downloader を使います。", "MP3 はプログレッシブ MP3 を優先し、利用可能なストリームが M4A の場合は保持します。", "WAV は利用可能な MP3 または AAC/M4A から PCM WAV を準備しますが、失われた詳細は復元しません。", "URL に /sets/ が含まれる場合は Playlist を使います。", "カバー画像だけが必要な場合は Artwork を使います。"], ctaPrimary: "Downloader を始める" },
  ko: { eyebrow: "SoundCloud 도구 모음", titleLead: "SoundCloud 도구로", titleAccent: "트랙, 플레이리스트와 아트워크 처리", intro: "접근 가능한 트랙을 MP3 또는 M4A로 다운로드하거나 사용 가능한 소스에서 PCM WAV를 준비합니다. 플레이리스트는 순서대로 처리하고 아트워크는 별도로 처리합니다.", proofPublic: "공개 도구", proofPublicValue: "가입 불필요", proofFormats: "형식", proofFormatsValue: "MP3 · M4A · WAV", quickEyebrow: "빠른 안내", quickTitleLead: "어떤 SoundCloud 도구를", quickTitleAccent: "사용할까요?", quickItems: ["URL이 트랙인지 플레이리스트인지 모르면 Downloader를 사용하세요.", "MP3는 프로그레시브 MP3를 우선하고 가능한 스트림이 M4A이면 유지합니다.", "WAV는 사용 가능한 MP3 또는 AAC/M4A에서 PCM WAV를 준비하지만 손실된 음질을 복원하지 않습니다.", "URL에 /sets/가 포함되어 있으면 Playlist를 사용하세요.", "커버 이미지만 필요하면 Artwork를 사용하세요."], ctaPrimary: "Downloader 시작" },
  no: { eyebrow: "SoundCloud-verktøy", titleLead: "SoundCloud-verktøy for", titleAccent: "spor, spillelister og artwork", intro: "Last ned tilgjengelige spor som MP3 eller M4A, eller klargjør PCM WAV fra den tilgjengelige kilden. Spillelister behandles i rekkefølge, og artwork behandles separat.", proofPublic: "Offentlige verktøy", proofPublicValue: "Ingen registrering", proofFormats: "Formater", proofFormatsValue: "MP3 · M4A · WAV", quickEyebrow: "Hurtigguide", quickTitleLead: "Hvilket SoundCloud-verktøy", quickTitleAccent: "bør jeg bruke?", quickItems: ["Bruk Downloader når du ikke vet om URL-en er et spor eller en spilleliste.", "Bruk MP3 for å foretrekke progressiv MP3 og beholde M4A når det er den tilgjengelige strømmen.", "Bruk WAV for å klargjøre PCM WAV fra tilgjengelig MP3- eller AAC/M4A-kilde uten å gjenopprette tapte detaljer.", "Bruk Playlist når URL-en inneholder /sets/.", "Bruk Artwork når du bare trenger coverbildet."], ctaPrimary: "Start med Downloader" },
  "zh-cn": { eyebrow: "SoundCloud 工具集", titleLead: "使用 SoundCloud 工具处理", titleAccent: "曲目、播放列表和封面", intro: "将可访问的曲目下载为 MP3 或 M4A，或从可用源准备 PCM WAV。播放列表会按顺序处理，封面则单独处理。", proofPublic: "公开工具", proofPublicValue: "无需注册", proofFormats: "格式", proofFormatsValue: "MP3 · M4A · WAV", quickEyebrow: "快速指南", quickTitleLead: "应该使用哪个 SoundCloud 工具", quickTitleAccent: "？", quickItems: ["不确定 URL 是单曲还是播放列表时，使用 Downloader。", "使用 MP3 可优先选择渐进式 MP3；只有 M4A 流可用时则保留 M4A。", "使用 WAV 可从可用的 MP3 或 AAC/M4A 源准备 PCM WAV，但不会恢复丢失的源细节。", "URL 包含 /sets/ 时，使用 Playlist。", "只需要封面图时，使用 Artwork。"], ctaPrimary: "从 Downloader 开始" },
  da: { eyebrow: "SoundCloud-værktøjer", titleLead: "SoundCloud-værktøjer til", titleAccent: "numre, playlister og artwork", intro: "Download tilgængelige numre som MP3 eller M4A, eller forbered PCM WAV fra den tilgængelige kilde. Playlister behandles i rækkefølge, og artwork håndteres separat.", proofPublic: "Offentlige værktøjer", proofPublicValue: "Ingen tilmelding", proofFormats: "Formater", proofFormatsValue: "MP3 · M4A · WAV", quickEyebrow: "Hurtig guide", quickTitleLead: "Hvilket SoundCloud-værktøj", quickTitleAccent: "skal jeg bruge?", quickItems: ["Brug Downloader, når du ikke ved, om URL’en er et nummer eller en playliste.", "Brug MP3 for at prioritere progressiv MP3 og beholde M4A, når det er den tilgængelige stream.", "Brug WAV for at forberede PCM WAV fra den tilgængelige MP3- eller AAC/M4A-kilde uden at genskabe tabte detaljer.", "Brug Playlist, når URL’en indeholder /sets/.", "Brug Artwork, når du kun har brug for coverbilledet."], ctaPrimary: "Start med Downloader" },
} as const

export default async function SoundCloudHubPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const copy = copyByLocale[locale as keyof typeof copyByLocale] || copyByLocale.en

  return (
    <div className="relative min-h-screen bg-slate-950">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(14,165,233,0.16),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(ellipse_50%_45%_at_90%_0%,rgba(34,211,238,0.1),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_55%_at_50%_0%,black,transparent)]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:py-12 md:space-y-12 md:py-14">
        <header className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200 sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" aria-hidden />
            {copy.eyebrow}
          </p>
          <h1 className="mx-auto mt-5 max-w-7xl text-balance text-[clamp(1.875rem,4.8vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.035em]">
            <span className="text-white">{copy.titleLead} </span>
            <span className={accentGradient}>{copy.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-5xl text-pretty text-base leading-7 text-slate-200 sm:text-lg">
            {copy.intro}
          </p>

          <dl className="mx-auto mt-8 grid max-w-lg grid-cols-2 gap-2 sm:gap-3">
            <div className="rounded-xl border border-slate-800/90 bg-slate-950/60 px-4 py-3 text-left">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[0.68rem]">
                {copy.proofPublic}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-violet-200 sm:text-base">
                {copy.proofPublicValue}
              </dd>
            </div>
            <div className="rounded-xl border border-sky-500/20 bg-sky-950/20 px-4 py-3 text-left">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sky-300/80 sm:text-[0.68rem]">
                {copy.proofFormats}
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-sky-200 sm:text-base">
                {copy.proofFormatsValue}
              </dd>
            </div>
          </dl>
        </header>

        <SoundCloudToolSwitcher current="hub" showHeader={false} />

        <section className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/60 p-5 md:p-8">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/45 to-transparent"
            aria-hidden
          />
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-300 sm:text-xs">
            {copy.quickEyebrow}
          </p>
          <h2 className="mt-2 text-[clamp(1.375rem,3vw,1.875rem)] font-bold leading-tight tracking-[-0.03em]">
            <span className="text-white">{copy.quickTitleLead} </span>
            <span className={accentGradient}>{copy.quickTitleAccent}</span>
          </h2>
          <ul className="mt-6 space-y-3">
            {copy.quickItems.map((item, index) => (
              <li
                key={item}
                className="flex gap-3 rounded-xl border border-slate-800/80 bg-slate-900/40 px-4 py-3.5 text-sm leading-6 text-slate-200 md:text-base"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-sky-400/25 bg-sky-500/10 text-xs font-bold tabular-nums text-sky-300">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex justify-center sm:justify-start">
            <Link
              href="/tools/soundcloud-downloader/"
              prefetch={false}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-semibold text-white shadow-[0_12px_40px_-16px_rgba(14,165,233,0.75)] transition-[background-color,box-shadow] hover:bg-sky-400 hover:shadow-[0_16px_48px_-14px_rgba(14,165,233,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
            >
              {copy.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
