import React from "react"
import { Type, Palette, Download, Sparkles } from "lucide-react"

export const ContentSections: React.FC = () => {
  return (
    <>
      {/* Modern Features Section */}
      <div className="mt-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">Professional-Grade Features</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-400">
            Everything you need to create stunning title cards with studio-quality results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Type className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">Advanced Typography</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              Professional text customization with authentic Invincible styling, outline effects,
              and precise typography controls for pixel-perfect results.
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Palette className="h-12 w-12 text-yellow-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">Character Presets</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              Instantly apply authentic color schemes for Mark, Omni-Man, Atom Eve, and other
              beloved characters with one-click preset configurations.
            </p>
          </div>

          <div className="group text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white shadow-xl backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white/10">
              <Download className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="mb-6 text-xl font-semibold text-white">Studio Export Quality</h3>
            <p className="text-lg leading-relaxed text-slate-400">
              Export in ultra-high resolution 1920×1080 PNG format, optimized for professional video
              production, social media, and presentation use.
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections for SEO - Modern Design */}
      <div className="mt-40 space-y-24">
        {/* About Section */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-yellow-500/10"></div>
          <div className="relative z-10">
            <h2 className="mb-8 text-3xl font-bold text-white">
              Create Professional Invincible-Style Title Cards
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-6 text-lg leading-relaxed text-slate-300">
                  Our advanced Invincible Title Card Generator empowers creators to produce
                  studio-quality title cards that capture the essence of the beloved animated
                  series. With intuitive controls and professional-grade output, bring your creative
                  vision to life.
                </p>
                <p className="text-lg leading-relaxed text-slate-300">
                  Whether you're creating fan videos, YouTube content, educational materials, or
                  professional presentations, our tool provides the flexibility and quality you need
                  to stand out from the crowd.
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm">
                <h3 className="mb-6 flex items-center text-xl font-semibold text-white">
                  <Sparkles className="mr-3 h-6 w-6 text-yellow-400" />
                  Premium Features
                </h3>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    Character-based color presets and themes
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    Advanced text customization and typography
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    Professional gradient backgrounds
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    High-resolution export (1920×1080)
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    Real-time preview and editing
                  </li>
                  <li className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-yellow-400"></div>
                    Save and manage favorite configurations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-12 shadow-2xl backdrop-blur-md">
          <h2 className="mb-12 text-center text-3xl font-bold text-white">
            How to Create Your Perfect Title Card
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 text-2xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Choose Your Style</h3>
              <p className="text-slate-400">
                Select from character presets or start with a blank canvas. Each preset includes
                optimized colors and styling for authentic results.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 text-2xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Customize Text</h3>
              <p className="text-slate-400">
                Enter your title and adjust typography settings. Fine-tune font size, outline, and
                positioning for the perfect look.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-2xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Design & Preview</h3>
              <p className="text-slate-400">
                Adjust colors, backgrounds, and effects while watching your changes in real-time.
                Use the fullscreen mode for detailed editing.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-500 text-2xl font-bold text-white">
                4
              </div>
              <h3 className="mb-3 text-lg font-semibold text-white">Export & Share</h3>
              <p className="text-slate-400">
                Download your title card in professional quality and share it across your projects,
                social media, or creative platforms.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="rounded-2xl bg-slate-800/90 p-10 shadow-2xl backdrop-blur-sm">
          <h2 className="mb-8 text-center text-3xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                What makes this title card generator special?
              </h3>
              <p className="leading-relaxed text-slate-300">
                Our generator is specifically designed to replicate the authentic look and feel of
                the Invincible animated series. We've carefully studied the show's typography, color
                schemes, and visual style to provide character-specific presets and
                professional-grade customization options that produce studio-quality results.
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Can I use these title cards for commercial projects?
              </h3>
              <p className="leading-relaxed text-slate-300">
                The title cards you create are yours to use for personal projects and fan content.
                For commercial use, please ensure you have the necessary rights and permissions. Our
                tool is designed for creative expression and educational purposes.
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                What resolution and format are the exported images?
              </h3>
              <p className="leading-relaxed text-slate-300">
                All title cards are exported in high-quality PNG format at 1920×1080 resolution
                (Full HD), perfect for video projects, presentations, and social media. The files
                maintain transparency where applicable and are optimized for both digital and print
                use.
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                How do I save my favorite configurations?
              </h3>
              <p className="leading-relaxed text-slate-300">
                Use the "Save" button to add your current configuration to your favorites. You can
                save multiple configurations and quickly switch between them by clicking on any
                saved preset in the favorites section. This feature helps you maintain consistency
                across multiple title cards or quickly experiment with different styles.
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-700/30 p-6">
              <h3 className="mb-3 text-xl font-semibold text-white">
                Is the tool completely free?
              </h3>
              <p className="leading-relaxed text-slate-300">
                Yes! Our Invincible Title Card Generator is completely free with no registration
                required, no hidden fees, and no watermarks (unless you choose to keep the
                attribution). Create unlimited title cards and download them at full resolution
                without any restrictions.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
