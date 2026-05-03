import React from "react"
import { toPrettyJson } from "../../../../../utils/bandcamp"
import type { InspectResult } from "../useBandcampDownloader"

type BandcampInspectorPanelProps = {
  urlInput: string
  loading: boolean
  result: InspectResult | null
  onUrlChange: (value: string) => void
  onInspect: () => void
  onDownload: (url: string, filename?: string, referer?: string) => void
  onOpenAnotherUrl: (url: string) => void
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/50"

const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"

export function BandcampInspectorPanel({
  urlInput,
  loading,
  result,
  onUrlChange,
  onInspect,
  onDownload,
  onOpenAnotherUrl,
}: BandcampInspectorPanelProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Smart URL inspector
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Paste any Bandcamp URL and let the tool decide the workflow
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          This is the friendliest entry point for most users. The API inspects the URL path and
          routes it into the right `bandcamp-scraper` method automatically: `track`, `album`, or
          `artist / label`.
        </p>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-3">
          <label className="text-sm font-medium text-slate-200" htmlFor="bandcamp-smart-url">
            Bandcamp URL
          </label>
          <input
            id="bandcamp-smart-url"
            className={inputClass}
            value={urlInput}
            onChange={(event) => onUrlChange(event.target.value)}
            placeholder="https://artist.bandcamp.com/track/song-name"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onInspect}
            className={primaryButtonClass}
            disabled={loading}
          >
            {loading ? "Inspecting..." : "Inspect this URL"}
          </button>
          <span className="inline-flex items-center rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-xs leading-5 text-amber-100">
            This tool can inspect albums and artists, but it only downloads audio when Bandcamp
            exposes a direct media URL.
          </span>
        </div>

        {!result ? (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
            Start with any Bandcamp track, album, artist, or label URL. The result card will adapt
            to the content type automatically.
          </div>
        ) : null}

        {result?.kind === "track" ? (
          <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              {result.summary?.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Bandcamp artwork URLs are dynamic remote assets
                <img
                  src={result.summary.coverUrl}
                  alt={result.summary.title}
                  className="h-32 w-full rounded-2xl object-cover sm:h-36 sm:w-36"
                />
              ) : (
                <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-xs text-slate-400 sm:h-36 sm:w-36">
                  No cover art
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xl font-semibold text-white">
                  {result.summary?.title || "Track summary"}
                </p>
                <dl className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  {result.summary?.artist ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Artist</dt>
                      <dd className="mt-1">{result.summary.artist}</dd>
                    </div>
                  ) : null}
                  {result.summary?.album ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">Album</dt>
                      <dd className="mt-1">{result.summary.album}</dd>
                    </div>
                  ) : null}
                  {result.summary?.durationText ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Duration
                      </dt>
                      <dd className="mt-1">{result.summary.durationText}</dd>
                    </div>
                  ) : null}
                  {result.summary?.releaseDate ? (
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Release date
                      </dt>
                      <dd className="mt-1">{result.summary.releaseDate}</dd>
                    </div>
                  ) : null}
                </dl>

                {result.summary?.playableUrl ? (
                  <div className="mt-4 space-y-3">
                    <audio
                      className="w-full"
                      controls
                      preload="none"
                      src={result.summary.playableUrl}
                    >
                      Your browser does not support audio playback.
                    </audio>
                    <button
                      type="button"
                      onClick={() =>
                        onDownload(
                          result.summary?.playableUrl || "",
                          result.filename,
                          result.sourceUrl
                        )
                      }
                      className={primaryButtonClass}
                    >
                      Download current playable link
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-400">
                    This track returned metadata, but no playable media URL has been exposed yet.
                  </p>
                )}
              </div>
            </div>

            {result.summary?.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.summary.tags.slice(0, 8).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            ) : null}

            {result.downloadLinks.length ? (
              <div className="mt-5 grid gap-3">
                {result.downloadLinks.map((item) => (
                  <div
                    key={item.url}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                      {item.label}
                    </p>
                    <p className="mt-2 break-all text-sm text-emerald-50">{item.url}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onDownload(item.url, result.filename, result.sourceUrl)}
                        className={primaryButtonClass}
                      >
                        Download this link
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className={secondaryButtonClass}
                      >
                        Open raw URL
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {result?.kind === "album" ? (
          <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              {result.summary?.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Bandcamp artwork URLs are dynamic remote assets
                <img
                  src={result.summary.coverUrl}
                  alt={result.summary.title || "Bandcamp album"}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {result.summary?.title || "Album summary"}
                </h3>
                <div className="mt-3 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
                  {result.summary?.artist ? (
                    <p>
                      <strong className="font-semibold text-white">Artist:</strong>{" "}
                      {result.summary.artist}
                    </p>
                  ) : null}
                  {result.summary?.releaseDate ? (
                    <p>
                      <strong className="font-semibold text-white">Release date:</strong>{" "}
                      {result.summary.releaseDate}
                    </p>
                  ) : null}
                  <p>
                    <strong className="font-semibold text-white">Products found:</strong>{" "}
                    {result.products.length}
                  </p>
                </div>
                {result.summary?.about ? (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                    {result.summary.about}
                  </p>
                ) : null}
              </div>
            </div>

            {result.summary?.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {result.summary.tags.slice(0, 8).map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                  >
                    #{item}
                  </span>
                ))}
              </div>
            ) : null}

            {result.products.length ? (
              <div className="mt-5 grid gap-2">
                {result.products.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-medium text-white">{item.name}</span>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        {item.type ? <span>{item.type}</span> : null}
                        {item.price ? <span>{item.price}</span> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                This album did not expose product rows in the current response.
              </p>
            )}
          </div>
        ) : null}

        {result?.kind === "artist" ? (
          <div className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              {result.summary?.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Bandcamp artwork URLs are dynamic remote assets
                <img
                  src={result.summary.coverUrl}
                  alt={result.summary.name || "Bandcamp artist"}
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold text-white">
                  {result.summary?.name || "Artist or label"}
                </h3>
                {result.summary?.location ? (
                  <p className="mt-1 text-sm text-slate-400">{result.summary.location}</p>
                ) : null}
                {result.summary?.bio ? (
                  <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                    {result.summary.bio}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-base font-semibold text-white">Albums and releases</h4>
                  <span className="text-xs text-slate-400">{result.albumUrls.length} found</span>
                </div>
                {result.albumUrls.length ? (
                  <div className="grid gap-2">
                    {result.albumUrls.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => onOpenAnotherUrl(url)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                      >
                        {url}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No album URLs were found on this page.</p>
                )}
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-base font-semibold text-white">Signed artists</h4>
                  <span className="text-xs text-slate-400">{result.artistUrls.length} found</span>
                </div>
                {result.artistUrls.length ? (
                  <div className="grid gap-2">
                    {result.artistUrls.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => onOpenAnotherUrl(url)}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10"
                      >
                        {url}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">
                    No signed artist URLs were found. This usually means the page is a standard
                    artist page, not a label index.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {result ? (
          <details className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-white">
              Raw API payload
            </summary>
            <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">
              {toPrettyJson(result.raw)}
            </pre>
          </details>
        ) : null}
      </div>
    </section>
  )
}
