import React from 'react'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata | undefined> {
  const title = 'PDF to Markdown - Fast & Free PDF to MD Converter'
  const description =
    'Convert PDFs to clean Markdown with formatting preserved. Free, secure, and no registration required. Perfect for developers and writers!'
  const publishedAt = new Date().toISOString()
  const modifiedAt = new Date().toISOString()
  const authors = [siteMetadata.author]
  return {
    title,
    description,
    keywords: ['pdf', 'markdown', 'convert'],
    openGraph: {
      title,
      description,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: siteMetadata.siteUrl + '/assets/images/social-banner.png',
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteMetadata.socialBanner],
    },
  }
}

const PdfToMarkdown = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex w-full flex-col gap-4 rounded-lg p-3 shadow-lg">
        <h1 className="text-center text-xl font-bold text-gray-800 md:text-2xl">
          PDF to Markdown Converter: Extract Text, Code & Tables with Formatting
        </h1>

        <h2 className="text-md font-semibold leading-8 tracking-tight">
          Convert PDF to Markdown in 3 Simple Steps:
        </h2>
        <h3>1. Upload your PDF file</h3>

        <div className="flex w-full items-center justify-center">
          <label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-800"
          >
            <span className="sr-only">Upload file</span>
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-4 h-8 w-8 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div>

        <h3>2. Edit the extracted text</h3>

        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="flex-1 rounded-lg bg-gray-50 p-3">
            <div className="mb-2 flex items-center">
              <h3 className="font-semibold">Edit Markdown</h3>
            </div>
            <div className="h-[200px] overflow-y-auto rounded border bg-white p-3">
              <p className="text-gray-400">PDF content will appear here...</p>
            </div>
          </div>

          <div className="flex-1 rounded-lg bg-gray-50 p-3">
            <div className="mb-2 flex items-center">
              <h3 className="font-semibold">Markdown Preview</h3>
            </div>
            <div className="h-[200px] overflow-y-auto rounded border bg-white p-3">
              <p className="text-gray-400">Converted markdown will appear here...</p>
            </div>
          </div>
        </div>
        <div>
          <h3>3. Download the Markdown file</h3>

          <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
            {/* <fieldset>
            <legend className="sr-only">Checkboxes</legend>

            <div className="space-2 flex flex-row items-center gap-2">
              <label htmlFor="Option1" className="flex cursor-pointer items-start gap-1">
                <div className="flex items-center">
                  &#8203;
                  <input
                    type="checkbox"
                    className="size-4 rounded-sm border-gray-300"
                    id="Option1"
                  />
                </div>

                <div>
                  <strong className="font-medium text-gray-900"> John Clapton </strong>
                </div>
              </label>

              <label htmlFor="Option2" className="flex cursor-pointer items-start gap-1">
                <div className="flex items-center">
                  &#8203;
                  <input
                    type="checkbox"
                    className="size-4 rounded-sm border-gray-300"
                    id="Option2"
                  />
                </div>

                <div>
                  <strong className="font-medium text-gray-900"> Peter Mayer </strong>
                </div>
              </label>
            </div>
          </fieldset> */}

            <button className="flex transform items-center gap-2 rounded-lg bg-primary-500 px-6 py-2 text-white transition-colors hover:scale-105 hover:bg-primary-700">
              Download Markdown
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PdfToMarkdown
