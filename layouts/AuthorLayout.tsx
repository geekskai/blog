import { ReactNode } from "react"
import type { Authors } from "contentlayer/generated"
import SocialIcon from "@/components/social-icons"
import Image from "@/components/Image"

interface Props {
  children: ReactNode
  content: Omit<Authors, "_id" | "_raw" | "body">
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  return (
    <>
      <div className="divide-y divide-stone-700">
        <div className="space-y-2 pb-6 pt-5 md:space-y-4 md:pb-8 md:pt-6">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-stone-100 sm:text-4xl md:text-5xl md:leading-tight xl:text-6xl">
            About
          </h1>
        </div>
        <div className="space-y-8 pt-6 md:space-y-10 md:pt-8 xl:grid xl:grid-cols-3 xl:items-start xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center rounded-2xl bg-stone-900/40 px-4 py-6 text-center ring-1 ring-stone-800 md:px-6 md:py-8 xl:sticky xl:top-24">
            {avatar && (
              <Image
                loading="lazy"
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className="h-28 w-28 rounded-full sm:h-32 sm:w-32 md:h-40 md:w-40 xl:h-48 xl:w-48"
              />
            )}
            <h3 className="pb-1 pt-4 text-xl font-bold leading-tight tracking-tight text-stone-100 md:pb-2 md:text-2xl">
              {name}
            </h3>
            <div className="text-sm leading-6 text-stone-400 md:text-base">{occupation}</div>
            <div className="text-sm leading-6 text-stone-300 md:text-base">{company}</div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-5 md:pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
            </div>
          </div>
          <div className="prose prose-invert max-w-none pb-8 text-sm leading-7 md:pb-10 md:text-base xl:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
