import { genPageMetadata } from "app/seo"
import React from "react"
import Link from "@/components/Link"

export const metadata = genPageMetadata({
  title: "Geekskai Terms of Service | 100% Free Online Tools",
  description:
    "Read the Geekskai Terms of Service. Discover our commitment to providing 100% free online tools, downloaders, and converters with no hidden fees or paywalls.",
})

const SITE_URL = "https://geekskai.com"
const LAST_UPDATED = "April 5, 2026"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-6 py-8 sm:px-8">
          <header className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Geekskai Terms of Service
            </h1>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              <strong className="font-semibold text-gray-700">Last updated:</strong> {LAST_UPDATED}
            </p>
          </header>

          <div className="mb-10 rounded-lg border-l-4 border-primary-500 bg-gray-50 p-6 text-gray-800 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              Our Core Promise: 100% Free Service
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Welcome to Geekskai! We are proud to offer a <strong>completely free platform</strong>
              . There are <strong>no subscriptions, no hidden fees, and no paywalls</strong> to use
              any of our online tools, downloaders, or converters. These Terms and Conditions
              outline the rules, regulations, and acceptable use policy for accessing Geekskai.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Support Contact:</strong>{" "}
              <Link
                href="mailto:postmaster@geekskai.com"
                className="font-medium text-primary-600 transition-colors hover:text-primary-500 hover:underline"
                aria-label="Email Geekskai Support"
              >
                postmaster@geekskai.com
              </Link>
            </p>
          </div>

          <div className="space-y-6 leading-relaxed text-gray-700">
            <p>
              By accessing our website located at{" "}
              <Link
                href={SITE_URL}
                className="font-medium text-primary-600 hover:text-primary-500"
                rel="noopener noreferrer"
              >
                {SITE_URL}
              </Link>{" "}
              (the &quot;Service&quot;), you assume full acceptance of these terms and conditions.
              Do not continue to use Geekskai if you do not agree to abide by all the terms stated
              on this page.
            </p>
          </div>

          <section className="mt-12" aria-labelledby="section-1">
            <h2
              id="section-1"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              1. Description of Free Services
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Geekskai is a comprehensive platform providing <strong>free online web tools</strong>,
              including audio and video converting utilities. All accessible features and
              functionalities are provided to you entirely at <strong>no cost</strong>.
            </p>
            <p className="leading-relaxed text-gray-700">
              We reserve the right to upgrade, modify, or discontinue any part of our free service
              at any time without prior notice. Our primary goal is to provide a robust, reliable,
              and continuously free user experience.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-2">
            <h2
              id="section-2"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              2. User Eligibility & Acceptance
            </h2>
            <p className="leading-relaxed text-gray-700">
              By utilizing Geekskai's suite of free online tools, you confirm that you are at least
              13 years of age. Use of this Service is void where prohibited. You represent and
              warrant that your access to our platform complies with all applicable local, state,
              national, and international laws and regulations.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-3">
            <h2
              id="section-3"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              3. Acceptable Use Policy
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              As a user of our 100% free platform, you agree to access the Service solely for legal
              and ethical purposes.
            </p>
            <h3 className="mb-3 mt-6 text-lg font-semibold text-gray-900">
              Your Responsibilities:
            </h3>
            <ul className="mb-8 list-disc space-y-2 pl-6 text-gray-700">
              <li>Evaluating and verifying the legality of the content you download or process.</li>
              <li>
                Obtaining the necessary permissions from copyright holders when handling third-party
                media.
              </li>
              <li>
                Respecting the fundamental rights of content creators, authors, and publishers.
              </li>
            </ul>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Prohibited Activities:</h3>
            <ul className="list-disc space-y-2 pl-6 text-gray-700">
              <li>
                Leveraging the Service to pirate, illegally distribute, or infringe upon copyrighted
                materials.
              </li>
              <li>
                Deploying malicious bots, scrapers, or automated exploits to overload our free
                infrastructure.
              </li>
              <li>
                Reverse engineering, decompiling, or otherwise tampering with Geekskai’s software.
              </li>
              <li>
                Bypassing security measures or fair-use quota systems implemented to ensure
                stability for all users.
              </li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="section-4">
            <h2
              id="section-4"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              4. Intellectual Property Rights
            </h2>
            <p className="leading-relaxed text-gray-700">
              Unless otherwise stated, Geekskai and/or its licensors own the intellectual property
              rights for all original material on this website (including branding, UI/UX design,
              text, logos, and custom code). You may access this for your own personal use subject
              to the restrictions set in these terms and conditions.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-5">
            <h2
              id="section-5"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              5. Third-Party Websites & External Content
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Some Geekskai tools interact with external platforms (such as social media networks,
              video, or audio hosting platforms). Geekskai acts merely as an automated conduit and
              processing provider; we{" "}
              <strong>do not host, store, or cache any copyrighted user media</strong> on our
              servers.
            </p>
            <p className="leading-relaxed text-gray-700">
              We do not endorse, nor are we liable for, the content provided by third-party links,
              user inputs, or via third-party integrations.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-6">
            <h2
              id="section-6"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              6. 100% Free Service Guarantee
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              We stand by our commitment that all core features on Geekskai are{" "}
              <strong>free forever</strong>. We guarantee the following:
            </p>
            <ul className="mb-6 list-disc space-y-3 pl-6 text-gray-700">
              <li>
                <strong>No Upfront Costs:</strong> Financial data, credit cards, or compulsory
                registration are never required to access our main tools.
              </li>
              <li>
                <strong>No Mandatory Paid Tiers:</strong> You receive our best processing
                capabilities at zero cost.
              </li>
              <li>
                <strong>No Hidden Conditions:</strong> The features advertised are exactly what you
                get, without unexpected paywalls.
              </li>
            </ul>
            <p className="rounded-md border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              * Note: While Geekskai is entirely free to use, standard data and internet browsing
              charges from your personal network provider still apply.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-7">
            <h2
              id="section-7"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              7. Operational Limits & Fair Use
            </h2>
            <p className="leading-relaxed text-gray-700">
              To maintain a fast, reliable, and completely free environment for thousands of global
              users, we may implement necessary technical limitations. These may include
              rate-limiting exceptionally high volume requests, bandwidth restrictions, or file size
              guidelines. These fair-use measures are enforced solely to prevent server abuse and
              assure equitable access for everyone.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-8">
            <h2
              id="section-8"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              8. Disclaimer of Warranties
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              To the maximum extent permitted by applicable law, we exclude all representations,
              warranties, and conditions relating to our website. Geekskai is provided on an{" "}
              <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong>{" "}
              basis.
            </p>
            <p className="leading-relaxed text-gray-700">
              We do not guarantee or warrant that the Service will remain uninterrupted,
              continuously perfectly secure, or completely error-free at all times.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-9">
            <h2
              id="section-9"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              9. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-gray-700">
              Because our website, tools, and services are provided completely free of charge, we
              will not be held liable for any loss or damage of any nature. In no event shall
              Geekskai be responsible for indirect, consequential, or incidental damages resulting
              from your use of, or inability to use, our platform.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-10">
            <h2
              id="section-10"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              10. DMCA & Copyright Infringement
            </h2>
            <p className="mb-4 leading-relaxed text-gray-700">
              Geekskai deeply respects the intellectual property rights of others. If you are a
              copyright owner or an agent thereof, and believe that any functionality or user action
              on Geekskai infringes upon your legally protected copyrights, we urge you to submit a
              formal infringement notice.
            </p>
            <p className="leading-relaxed text-gray-700">
              Please include proof of copyright ownership and specific URLs, and email us directly
              at
              <Link
                href="mailto:postmaster@geekskai.com"
                className="ml-1 font-medium text-primary-600 hover:text-primary-500"
              >
                postmaster@geekskai.com
              </Link>
              . We will promptly investigate and block any infringing capabilities upon validation.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-11">
            <h2
              id="section-11"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              11. Modifications to Terms
            </h2>
            <p className="leading-relaxed text-gray-700">
              We maintain the right to revise or modify these Terms of Service at any given time to
              reflect new features or legal requirements. By continuing to use Geekskai following
              the publication of any modifications, you implicitly agree to be legally bound by the
              most recent updated terms.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="section-12">
            <h2
              id="section-12"
              className="mb-4 border-b border-gray-200 pb-2 text-2xl font-bold text-gray-900"
            >
              12. Governing Law
            </h2>
            <p className="leading-relaxed text-gray-700">
              Any dispute, controversy, or claim relating to your use of this Service will be
              governed by and interpreted in accordance with standard international law principles,
              without regard to its conflict of law provisions.
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
