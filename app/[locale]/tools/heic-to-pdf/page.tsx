import HeicConverter from "./components/HeicConverter"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="text-center">
              <h1 className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-6xl font-bold text-transparent">
                HEIC to PDF Converter - Free Online Tool
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Convert HEIC images to PDF or JPEG format instantly in your browser. 100% free, no
                uploads required, privacy-first, batch processing supported. Works on iPhone, iPad,
                Mac, Windows, Android, and all modern browsers. No software installation needed.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <HeicConverter />

          {/* SEO Content Sections - Only show when no files */}
          <div className="mt-20 space-y-16">
            {/* Features Section */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Lightning Fast Conversion</h3>
                <p className="text-slate-400">
                  Advanced browser-based processing ensures rapid HEIC to PDF conversion without
                  compromising quality.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Quality Preserved</h3>
                <p className="text-slate-400">
                  Intelligent image processing maintains original quality and supports advanced
                  customization options.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">Privacy First</h3>
                <p className="text-slate-400">
                  All HEIC to PDF processing happens locally in your browser. Your images never
                  leave your device.
                </p>
              </div>
            </div>

            {/* How to Use Section */}
            <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-white">
                How to Use Our HEIC to PDF Converter: Complete Guide
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      1
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Upload Your HEIC Files</h3>
                      <p className="text-slate-400">
                        Drag and drop HEIC images or click to browse. Our converter supports batch
                        upload for multiple files.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      2
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Configure Output Settings</h3>
                      <p className="text-slate-400">
                        Choose output format (PDF or JPEG), customize page size, image dimensions,
                        and metadata options.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      3
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Automatic Conversion</h3>
                      <p className="text-slate-400">
                        Our converter automatically processes your files, converting HEIC to PDF
                        while preserving quality and structure.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-900 text-sm font-medium text-blue-400">
                      4
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">Download Results</h3>
                      <p className="text-slate-400">
                        Download your converted PDF or JPEG files instantly. Files are processed
                        locally for complete privacy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SEO Rich Content Sections */}
            <section className="rounded-xl bg-slate-800 p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-white">
                Why Choose Our HEIC to PDF Converter?
              </h2>
              <div className="space-y-4 text-slate-300">
                <p>
                  Our HEIC to PDF converter is the perfect solution for anyone who needs to convert
                  Apple's HEIC image format to the universally compatible PDF or JPEG format.
                  Whether you're using an iPhone, iPad, or Mac, our tool handles HEIC files
                  seamlessly without requiring any software installation.
                </p>
                <p>
                  <strong className="text-white">Key Features:</strong> Batch conversion support
                  allows you to convert multiple HEIC files simultaneously. Advanced options let you
                  customize PDF page size (A4, Letter, or image size), adjust image dimensions, and
                  control metadata handling. All processing happens locally in your browser,
                  ensuring complete privacy and security.
                </p>
                <p>
                  <strong className="text-white">Perfect For:</strong> Students submitting
                  assignments, professionals sharing reports, designers preparing print files,
                  photographers archiving work, and anyone who needs to make Apple device photos
                  accessible on Windows, Android, or web platforms.
                </p>
              </div>
            </section>

            {/* FAQ Section with Schema */}
            <section
              className="rounded-xl bg-slate-800 p-8"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              <h2 className="mb-6 text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Is my data safe when converting HEIC to PDF?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      Yes, absolutely. All HEIC to PDF conversion happens entirely in your browser.
                      Your images never leave your device, ensuring complete privacy and security.
                      No uploads, no tracking, no data collection.
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Are there any file size or quantity limits?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      No, there are no limits. You can convert as many HEIC images to PDF as you
                      need, regardless of file size or quantity. Our converter handles batch
                      processing efficiently.
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Will I lose image quality when converting HEIC to PDF?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      No, our HEIC to PDF converter preserves the original quality of your images.
                      You can also customize output dimensions and quality settings in the advanced
                      options.
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Can I convert HEIC to PDF on mobile devices?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      Yes, our HEIC to PDF converter works perfectly on iPhone, iPad, Android
                      devices, and all modern mobile browsers. No app installation required.
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Can I convert multiple HEIC files at once?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      Yes, batch conversion is fully supported. You can upload multiple HEIC files
                      and convert them all at once. You can also merge multiple HEIC images into a
                      single PDF file.
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    What's the difference between converting HEIC to PDF vs JPEG?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      PDF format is ideal for documents, printing, and sharing professional work.
                      JPEG format is better for web use, social media, and general image sharing.
                      Our converter supports both formats with customizable quality settings.
                    </p>
                  </div>
                </div>
                <div
                  className="border-b border-slate-700 pb-4"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Do I need to install any software?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      No, our HEIC to PDF converter is completely web-based. It works directly in
                      your browser on any device - Windows, Mac, Linux, iPhone, iPad, or Android. No
                      downloads or installations required.
                    </p>
                  </div>
                </div>
                <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="mb-2 text-lg font-semibold text-white" itemProp="name">
                    Can I customize PDF page size and image dimensions?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-slate-400" itemProp="text">
                      Yes, our advanced options allow you to choose PDF page size (A4, Letter, or
                      match image dimensions), set custom width and height, and select fit modes
                      (max fit, crop, or scale). Perfect for professional printing and document
                      preparation.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
