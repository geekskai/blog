'use client'
import Image from '@/components/Image'

// import { motion } from 'framer-motion'
// import Link from 'next/link'
import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

import { ReactElement, useEffect, useRef } from 'react'
// import { HiOutlineArrowNarrowDown } from 'react-icons/hi'
// import { ScrollContext } from './Providers/ScrollProvider'
import { renderCanvas } from './renderCanvas'
import Github from './Github'
import { allAuthors, Authors } from 'contentlayer/generated'
import { coreContent } from 'pliny/utils/contentlayer'

export default function Hero(): ReactElement {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const { name, occupation } = coreContent(author)

  useEffect(() => {
    renderCanvas()
  }, [])

  return (
    <div>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-2xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
          I'm{' '}
          <span className="dark:from-secondary-700 dark:to-secondary-400 mt-10 bg-gradient-to-r from-primary-700 to-primary-400 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            {name}
          </span>{' '}
          👋
        </h1>
        <div className="dark:text-grey text-gray mb-8  mt-4 text-base">
          <p className="text-gray dark:text-gray text-lg leading-7">{siteMetadata.description}</p>
          <p className="mt-3">{occupation}</p>
          <Github />
          <p>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🛠️ JavaScript</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🥇 TypeScript</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">❤️ React.js</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">❤️‍🩹 Vue.js</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🥇 Next.js</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">📦 Node.js</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🎨 Tailwind CSS</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">📦 Webpack</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">⏳ Vite</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🧊 HTML</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🍡 CSS</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🕰️ Git</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🚃 Npm</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🧶 Yarn</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">📜 PNpm</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🎢 Redux</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🍤 Zustand</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🤖 OpenAI API</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🧱 Material UI</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🐜 Ant Design</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">⏳ Esbuild</span>
            <span className="mr-3 inline-block whitespace-nowrap pt-3">🍽️ APIs</span>
          </p>
        </div>
      </div>
      <Link
        className="inline-block w-full text-right text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        aria-label={`Read more about me`}
        href="/about"
        // className="underline-magical text-md w-max cursor-pointer sm:text-lg md:text-xl xl:text-2xl"
      >
        Read more about me &rarr;
      </Link>
      {/* <div className="relative z-10 flex h-[calc(100vh-400px)]  md:h-[calc(100vh-340px)]">
        <div className=" flex cursor-default flex-col gap-5 space-y-2">
          <h1 className="text-5xl font-semibold sm:text-7xl md:text-8xl xl:text-9xl">
            {siteMetadata.title}
          </h1>
          <h2 className="text-xl font-medium opacity-80 sm:text-2xl md:text-3xl xl:text-4xl">
            {siteMetadata.description}
          </h2>
          <Link
            className="inline-block w-full text-right text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label={`Read more about me`}
            href="/about"
            // className="underline-magical text-md w-max cursor-pointer sm:text-lg md:text-xl xl:text-2xl"
          >
            Read more about me &rarr;
          </Link>
        </div>
      </div> */}
      <canvas className="bg-skin-base pointer-events-none absolute inset-0" id="canvas"></canvas>
    </div>
  )
}
