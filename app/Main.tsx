import Hero from "@/components/Hero"
import ListLayout from "@/layouts/ListLayout"

const HOMEPAGE_POST_COUNT = 4

export default function Home({ posts }) {
  const homepagePosts = posts.slice(0, HOMEPAGE_POST_COUNT)

  return (
    <div className="selection:bg-sky-400/30 selection:text-white">
      {/*
        THESIS: Geekskai opens as a working utility bench, not a developer portfolio.
        OWN-WORLD: Midnight slate layers, fine borders, sky for active work, violet for output.
        STORY: Understand the result, trust local processing, open a tool, then learn more.
        FIRST VIEWPORT: Outcome copy leads; an illustrative Audio Toolkit workflow proves the mechanism beside it.
        FORM: Code-led, product-first homepage in the established Midnight Utility Bench system.
        FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
      */}
      <Hero />

      <section
        aria-labelledby="home-guides-title"
        className="border-t border-slate-800/80 bg-slate-950/45"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 2xl:px-0">
          <ListLayout posts={homepagePosts} />
        </div>
      </section>
    </div>
  )
}
