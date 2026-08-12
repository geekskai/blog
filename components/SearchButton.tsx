import { AlgoliaButton } from "pliny/search/AlgoliaButton"
import { KBarButton } from "pliny/search/KBarButton"
import siteMetadata from "@/data/siteMetadata"

const SearchButton = () => {
  if (
    siteMetadata.search &&
    (siteMetadata.search.provider === "algolia" || siteMetadata.search.provider === "kbar")
  ) {
    const SearchButtonWrapper =
      siteMetadata.search.provider === "algolia" ? AlgoliaButton : KBarButton

    return (
      <SearchButtonWrapper
        aria-label="Search"
        className="group inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
        style={{ width: "2.75rem", minWidth: "2.75rem" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6 text-stone-100 transition-colors duration-200 group-hover:text-primary-400 motion-reduce:transition-none"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </SearchButtonWrapper>
    )
  }
}

export default SearchButton
