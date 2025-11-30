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
                HEIC to PDF Converter
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-slate-300">
                Instantly convert HEIC images to PDF with our advanced, privacy-first online tool.
                No uploads, no registration, no limits—just fast, secure, and high-quality
                conversion in your browser.
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

            {/* FAQ Section */}
            <section className="rounded-xl bg-slate-800 p-8">
              <h2 className="mb-6 text-2xl font-bold text-white">Quick FAQ</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">Is my data safe?</h3>
                  <p className="text-slate-400">
                    Yes, all HEIC to PDF conversion happens in your browser. No uploads, no
                    tracking, total privacy.
                  </p>
                </div>
                <div className="border-b border-slate-700 pb-4">
                  <h3 className="mb-2 text-lg font-semibold text-white">Are there any limits?</h3>
                  <p className="text-slate-400">
                    No file size or number limits. Convert as many HEIC images to PDF as you need.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    Will I lose image quality?
                  </h3>
                  <p className="text-slate-400">
                    No, our HEIC to PDF tool preserves the original quality of your images.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
