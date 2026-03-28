import { genPageMetadata } from "app/seo"
import React from "react"
import Link from "@/components/Link"

export const metadata = genPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of Service for Geekskai: eligibility, acceptable use, payments, liability, and contact information.",
})

const SITE_URL = "https://geekskai.com"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-6 py-8 sm:px-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mb-8 text-center text-sm text-gray-600">
            <strong className="font-medium text-gray-700">Last updated:</strong> March 27, 2026
          </p>

          <div className="space-y-4 text-gray-700">
            <p>
              Welcome to Geekskai (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By accessing
              or using our website{" "}
              <Link
                href={SITE_URL}
                className="text-primary-500 hover:text-primary-400"
                rel="noopener noreferrer"
              >
                {SITE_URL}
              </Link>{" "}
              (the &quot;Service&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;).
            </p>
            <p>If you do not agree with these Terms, please do not use our Service.</p>
          </div>

          <section className="mt-12" aria-labelledby="section-1">
            <h2 id="section-1" className="mb-4 text-2xl font-semibold text-gray-900">
              1. Description of Service
            </h2>
            <p className="mb-4 text-gray-700">
              Geekskai provides online tools, including but not limited to audio downloading and
              conversion tools (for example, SoundCloud to WAV or MP3 converters).
            </p>
            <p className="text-gray-700">
              We reserve the right to modify, suspend, or discontinue any part of the Service at any
              time without notice.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-2">
            <h2 id="section-2" className="mb-4 text-2xl font-semibold text-gray-900">
              2. Eligibility
            </h2>
            <p className="mb-4 text-gray-700">
              You must be at least 13 years old to use this Service.
            </p>
            <p className="text-gray-700">
              By using Geekskai, you represent and warrant that you meet this requirement.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-3">
            <h2 id="section-3" className="mb-4 text-2xl font-semibold text-gray-900">
              3. User Responsibilities
            </h2>
            <p className="mb-4 text-gray-700">
              You agree to use the Service only for lawful purposes.
            </p>
            <p className="mb-3 font-medium text-gray-900">You are solely responsible for:</p>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
              <li>The content you access or download</li>
              <li>Ensuring you have the legal right to download or use such content</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>
            <p className="mb-3 font-medium text-gray-900">You agree not to:</p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>Use the Service to download copyrighted content without permission</li>
              <li>Reverse engineer, hack, or disrupt the Service</li>
              <li>Use automated systems (bots, scripts) to abuse the Service</li>
              <li>Attempt to bypass usage limits or payment systems</li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="section-4">
            <h2 id="section-4" className="mb-4 text-2xl font-semibold text-gray-900">
              4. Intellectual Property
            </h2>
            <p className="mb-4 text-gray-700">
              All content, branding, design, and software on Geekskai are owned by us or our
              licensors.
            </p>
            <p className="mb-3 font-medium text-gray-900">You may not:</p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>Copy, reproduce, or redistribute any part of the Service</li>
              <li>Use our branding without permission</li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="section-5">
            <h2 id="section-5" className="mb-4 text-2xl font-semibold text-gray-900">
              5. Third-Party Content
            </h2>
            <p className="mb-4 text-gray-700">
              Geekskai may interact with third-party platforms (for example, SoundCloud).
            </p>
            <p className="mb-4 text-gray-700">
              We do not host or store any copyrighted media files on our servers.
            </p>
            <p className="text-gray-700">
              All content is processed on demand, and we are not responsible for third-party
              content.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-6">
            <h2 id="section-6" className="mb-4 text-2xl font-semibold text-gray-900">
              6. Payments &amp; Subscriptions
            </h2>
            <p className="mb-4 text-gray-700">Some features of the Service may require payment.</p>
            <p className="mb-3 font-medium text-gray-900">
              By purchasing a subscription or credits:
            </p>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
              <li>You agree to pay all applicable fees</li>
              <li>
                Payments are processed via third-party providers (for example,{" "}
                <strong className="font-semibold">Creem</strong>)
              </li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Billing</h3>
            <ul className="mb-6 list-disc space-y-2 pl-6 text-gray-700">
              <li>Subscriptions may be billed on a recurring basis (monthly or yearly)</li>
              <li>You can cancel at any time, but refunds are not guaranteed</li>
            </ul>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">Refund Policy</h3>
            <p className="text-gray-700">
              All payments are generally <strong className="font-semibold">non-refundable</strong>,
              unless required by law.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-7">
            <h2 id="section-7" className="mb-4 text-2xl font-semibold text-gray-900">
              7. Usage Limits
            </h2>
            <p className="mb-3 font-medium text-gray-900">
              Free users may be subject to limitations, including:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
              <li>Number of downloads per day</li>
              <li>File quality restrictions</li>
              <li>Feature access limitations</li>
            </ul>
            <p className="text-gray-700">
              We reserve the right to enforce these limits at our discretion.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-8">
            <h2 id="section-8" className="mb-4 text-2xl font-semibold text-gray-900">
              8. Termination
            </h2>
            <p className="mb-3 font-medium text-gray-900">
              We may suspend or terminate your access if you:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>Violate these Terms</li>
              <li>Abuse the Service</li>
              <li>Engage in fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="section-9">
            <h2 id="section-9" className="mb-4 text-2xl font-semibold text-gray-900">
              9. Disclaimer of Warranties
            </h2>
            <p className="mb-4 text-gray-700">
              The Service is provided &quot;as is&quot; and &quot;as available&quot;.
            </p>
            <p className="mb-3 font-medium text-gray-900">We make no warranties regarding:</p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>Availability or uptime</li>
              <li>Accuracy or reliability</li>
              <li>Suitability for any purpose</li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="section-10">
            <h2 id="section-10" className="mb-4 text-2xl font-semibold text-gray-900">
              10. Limitation of Liability
            </h2>
            <p className="mb-3 font-medium text-gray-900">
              To the maximum extent permitted by law, Geekskai shall not be liable for:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>Any indirect or consequential damages</li>
              <li>Loss of data or profits</li>
              <li>Issues arising from third-party services</li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="section-11">
            <h2 id="section-11" className="mb-4 text-2xl font-semibold text-gray-900">
              11. Copyright Policy
            </h2>
            <p className="mb-4 text-gray-700">We respect intellectual property rights.</p>
            <p className="mb-3 text-gray-700">
              If you believe your content has been used improperly, please contact us with:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-gray-700">
              <li>Proof of ownership</li>
              <li>Relevant URLs</li>
            </ul>
            <p className="text-gray-700">We will review and take appropriate action.</p>
          </section>

          <section className="mt-12" aria-labelledby="section-12">
            <h2 id="section-12" className="mb-4 text-2xl font-semibold text-gray-900">
              12. Changes to Terms
            </h2>
            <p className="mb-4 text-gray-700">We may update these Terms at any time.</p>
            <p className="text-gray-700">
              Continued use of the Service after changes means you accept the updated Terms.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-13">
            <h2 id="section-13" className="mb-4 text-2xl font-semibold text-gray-900">
              13. Contact Us
            </h2>
            <p className="mb-4 text-gray-700">
              If you have any questions about these Terms, please contact:
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold text-gray-900">Email:</strong>{" "}
              <Link
                href="mailto:postmaster@geekskai.com"
                className="text-primary-500 hover:text-primary-400"
              >
                postmaster@geekskai.com
              </Link>
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-14">
            <h2 id="section-14" className="mb-4 text-2xl font-semibold text-gray-900">
              14. Governing Law
            </h2>
            <p className="text-gray-700">
              These Terms shall be governed by and interpreted in accordance with applicable
              international laws.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
