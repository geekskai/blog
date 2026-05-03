import React from "react"
import { toPrettyJson } from "../../../../../utils/bandcamp"
import type { DiscoverResultData, SearchResultData } from "../useBandcampDownloader"

type BandcampDiscoveryPanelProps = {
  activeTab: "search" | "tag"
  searchQuery: string
  searchPage: number
  tag: string
  tagPage: number
  searchResult: SearchResultData | null
  discoverResult: DiscoverResultData | null
  isSearchLoading: boolean
  isTagLoading: boolean
  onTabChange: (value: "search" | "tag") => void
  onSearchQueryChange: (value: string) => void
  onSearchPageChange: (value: number) => void
  onTagChange: (value: string) => void
  onTagPageChange: (value: number) => void
  onSearch: () => void
  onDiscover: () => void
  onSelectUrl: (url: string) => void
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"

const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-400/50"

const secondaryButtonClass =
  "inline-flex min-h-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-white/10"

function SectionTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: "search" | "tag"
  onTabChange: (value: "search" | "tag") => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {[
        {
          id: "search" as const,
          title: "Keyword search",
          description: "Find artists, labels, albums, or tracks by text query.",
        },
        {
          id: "tag" as const,
          title: "Tag discovery",
          description: "Explore albums by genre, mood, or community tags.",
        },
      ].map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-cyan-400/40 bg-cyan-400/10"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
            }`}
          >
            <p className="text-sm font-semibold text-white">{tab.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{tab.description}</p>
          </button>
        )
      })}
    </div>
  )
}

export function BandcampDiscoveryPanel({
  activeTab,
  searchQuery,
  searchPage,
  tag,
  tagPage,
  searchResult,
  discoverResult,
  isSearchLoading,
  isTagLoading,
  onTabChange,
  onSearchQueryChange,
  onSearchPageChange,
  onTagChange,
  onTagPageChange,
  onSearch,
  onDiscover,
  onSelectUrl,
}: BandcampDiscoveryPanelProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          Discovery workspace
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Search Bandcamp when you do not have a URL yet
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          This workspace is built around the library&apos;s strongest discovery features: keyword
          search and tag exploration. Every result card routes directly back into the smart URL
          inspector.
        </p>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <SectionTabs activeTab={activeTab} onTabChange={onTabChange} />

        {activeTab === "search" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
              <div className="grid gap-3">
                <label
                  className="text-sm font-medium text-slate-200"
                  htmlFor="bandcamp-search-query"
                >
                  Search keyword
                </label>
                <input
                  id="bandcamp-search-query"
                  className={inputClass}
                  value={searchQuery}
                  onChange={(event) => onSearchQueryChange(event.target.value)}
                  placeholder="artist, album, label, or track name"
                />
              </div>

              <div className="grid gap-3">
                <label
                  className="text-sm font-medium text-slate-200"
                  htmlFor="bandcamp-search-page"
                >
                  Page
                </label>
                <input
                  id="bandcamp-search-page"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={searchPage}
                  onChange={(event) => onSearchPageChange(Number(event.target.value) || 1)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onSearch}
              className={primaryButtonClass}
              disabled={isSearchLoading}
            >
              {isSearchLoading ? "Searching..." : "Search Bandcamp"}
            </button>

            {searchResult?.items.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {searchResult.items.map((item) => (
                  <div
                    key={`${item.type}-${item.url}`}
                    className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4"
                  >
                    <div className="flex gap-3">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- Bandcamp result artwork URLs are dynamic
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-2xl border border-dashed border-white/10 bg-white/5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                          {item.type}
                        </p>
                        <p className="mt-1 text-base font-semibold text-white">{item.name}</p>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block truncate text-xs text-slate-400 hover:text-cyan-200"
                        >
                          {item.url}
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => onSelectUrl(item.url)}
                        className={primaryButtonClass}
                      >
                        Inspect this URL
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className={secondaryButtonClass}
                      >
                        Open Bandcamp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResult ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
                No search results came back for this query. Try a broader artist or track name.
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
                Search results will appear here and can be sent straight into the URL inspector.
              </div>
            )}

            {searchResult ? (
              <details className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  Raw search payload
                </summary>
                <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">
                  {toPrettyJson(searchResult.raw)}
                </pre>
              </details>
            ) : null}
          </>
        ) : null}

        {activeTab === "tag" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_120px]">
              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-200" htmlFor="bandcamp-tag-query">
                  Bandcamp tag
                </label>
                <input
                  id="bandcamp-tag-query"
                  className={inputClass}
                  value={tag}
                  onChange={(event) => onTagChange(event.target.value)}
                  placeholder="ambient, jazz, drone, techno..."
                />
              </div>

              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-200" htmlFor="bandcamp-tag-page">
                  Page
                </label>
                <input
                  id="bandcamp-tag-page"
                  type="number"
                  min={1}
                  className={inputClass}
                  value={tagPage}
                  onChange={(event) => onTagPageChange(Number(event.target.value) || 1)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={onDiscover}
              className={primaryButtonClass}
              disabled={isTagLoading}
            >
              {isTagLoading ? "Finding releases..." : "Find releases by tag"}
            </button>

            {discoverResult?.items.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {discoverResult.items.map((item) => (
                  <div
                    key={`${item.url || item.title}`}
                    className="rounded-[24px] border border-white/10 bg-slate-950/50 p-4"
                  >
                    <div className="flex gap-3">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- Bandcamp result artwork URLs are dynamic
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-2xl border border-dashed border-white/10 bg-white/5" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-white">{item.title}</p>
                        {item.subtitle ? (
                          <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                        ) : null}
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 block truncate text-xs text-slate-400 hover:text-cyan-200"
                          >
                            {item.url}
                          </a>
                        ) : null}
                      </div>
                    </div>

                    {item.url ? (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => onSelectUrl(item.url || "")}
                          className={primaryButtonClass}
                        >
                          Inspect this URL
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className={secondaryButtonClass}
                        >
                          Open Bandcamp
                        </a>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : discoverResult ? (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
                No tag results came back for this page. Try a broader genre or switch the page
                number.
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-slate-950/30 p-4 text-sm leading-6 text-slate-400">
                Tag-based discovery is useful when you want ideas rather than a specific artist URL.
              </div>
            )}

            {discoverResult ? (
              <details className="rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-white">
                  Raw tag payload
                </summary>
                <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-200">
                  {toPrettyJson(discoverResult.raw)}
                </pre>
              </details>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  )
}
