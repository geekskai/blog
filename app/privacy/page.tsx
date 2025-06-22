import { genPageMetadata } from "app/seo"
import Link from "@/components/Link"

export const metadata = genPageMetadata({ title: "Privacy" })

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="px-6 py-8">
          <h1 className="mb-6 text-center text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mb-8 text-center text-sm text-gray-600">Last updated: January 08, 2025</p>
          <div className="space-y-6 text-gray-700">
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and
              disclosure of Your information when You use the Service and tells You about Your
              privacy rights and how the law protects You.
            </p>
            <p>
              We use Your Personal data to provide and improve the Service. By using the Service,
              You agree to the collection and use of information in accordance with this Privacy
              Policy.
            </p>
          </div>
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-900">
            Interpretation and Definitions
          </h2>
          <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900">Interpretation</h3>
          <p className="mb-4 text-gray-700">
            The words of which the initial letter is capitalized have meanings defined under the
            following conditions. The following definitions shall have the same meaning regardless
            of whether they appear in singular or in plural.
          </p>
          <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900">Definitions</h3>
          <p className="mb-4 text-gray-700">For the purposes of this Privacy Policy:</p>
          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <p>
                <strong>Account</strong> means a unique account created for You to access our
                Service or parts of our Service.
              </p>
            </li>
            <li>
              <p>
                <strong>Affiliate</strong> means an entity that controls, is controlled by or is
                under common control with a party, where &quot;control&quot; means ownership of 50%
                or more of the shares, equity interest or other securities entitled to vote for
                election of directors or other managing authority.
              </p>
            </li>
            <li>
              <p>
                <strong>Company</strong> (referred to as either &quot;the Company&quot;,
                &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to geeks
                kai.
              </p>
            </li>
            <li>
              <p>
                <strong>Cookies</strong> are small files that are placed on Your computer, mobile
                device or any other device by a website, containing the details of Your browsing
                history on that website among its many uses.
              </p>
            </li>
            <li>
              <p>
                <strong>Country</strong> refers to: New York, United States
              </p>
            </li>
            <li>
              <p>
                <strong>Device</strong> means any device that can access the Service such as a
                computer, a cellphone or a digital tablet.
              </p>
            </li>
            <li>
              <p>
                <strong>Personal Data</strong> is any information that relates to an identified or
                identifiable individual.
              </p>
            </li>
            <li>
              <p>
                <strong>Service</strong> refers to the Website.
              </p>
            </li>
            <li>
              <p>
                <strong>Service Provider</strong> means any natural or legal person who processes
                the data on behalf of the Company. It refers to third-party companies or individuals
                employed by the Company to facilitate the Service, to provide the Service on behalf
                of the Company, to perform services related to the Service or to assist the Company
                in analyzing how the Service is used.
              </p>
            </li>
            <li>
              <p>
                <strong>Usage Data</strong> refers to data collected automatically, either generated
                by the use of the Service or from the Service infrastructure itself (for example,
                the duration of a page visit).
              </p>
            </li>
            <li>
              <p>
                <strong>Website</strong> refers to geeks kai, accessible from{" "}
                <Link
                  href="https://geekskai.com/"
                  rel="external nofollow noopener"
                  target="_blank"
                  className="text-primary-500 hover:text-primary-400"
                  aria-label="geekskai website link"
                >
                  https://geekskai.com/
                </Link>
              </p>
            </li>
            <li>
              <p>
                <strong>You</strong> means the individual accessing or using the Service, or the
                company, or other legal entity on behalf of which such individual is accessing or
                using the Service, as applicable.
              </p>
            </li>
          </ul>
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-900">
            Collecting and Using Your Personal Data
          </h2>
          <h3 className="mb-3 mt-8 text-xl font-semibold text-gray-900">Types of Data Collected</h3>
          <h4 className="mb-2 mt-6 text-lg font-semibold text-gray-900">Personal Data</h4>
          <p className="mb-4 text-gray-700">
            While using Our Service, We may ask You to provide Us with certain personally
            identifiable information that can be used to contact or identify You. Personally
            identifiable information may include, but is not limited to:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <p>Email address</p>
            </li>
            <li>
              <p>First name and last name</p>
            </li>
            <li>
              <p>Usage Data</p>
            </li>
          </ul>

          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-900">Third-party Services</h2>

          <p className="mb-4 text-gray-700">We use the following third-party services:</p>

          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>
              <p>
                <strong>Google Analytics</strong>
                <br />
                1. Purpose: Website traffic analysis
                <br />
                2. Data collected: Usage patterns, device information, location data
                <br />
                3. More information:{" "}
                <Link
                  href="https://policies.google.com/privacy?hl=en"
                  rel="external nofollow noopener"
                  target="_blank"
                  className="text-primary-500 hover:text-primary-400"
                  aria-label="Google Analytics Privacy Policy link"
                >
                  Google Analytics Privacy Policy
                </Link>
              </p>
            </li>
            <li>
              <p>
                <strong>Google Adsense</strong>
                <br />
                1. Purpose: Display personalized advertisements
                <br />
                2. Data collected: Browsing preferences, interests
                <br />
                3. More information:{" "}
                <Link
                  href="https://policies.google.com/privacy?hl=en"
                  rel="external nofollow noopener"
                  target="_blank"
                  className="text-primary-500 hover:text-primary-400"
                  aria-label="Google Adsense Privacy Policy link"
                >
                  Google Adsense Privacy Policy
                </Link>
              </p>
            </li>
          </ul>

          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-900">Cookie Policy</h2>
          <p className="mb-4 text-gray-700">
            Our website uses cookies to enhance your browsing experience:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>Essential cookies: Required for website functionality</li>
            <li>Analytics cookies: Help us understand how visitors use our site</li>
            <li>Advertising cookies: Used to deliver relevant advertisements</li>
          </ul>
          <p className="mb-4 text-gray-700">
            You can manage your cookie preferences through your browser settings.
          </p>

          {/* The rest of the content follows the same pattern... */}
          <h2 className="mb-4 mt-12 text-2xl font-semibold text-gray-900">Contact Us</h2>
          <p className="mb-4 text-gray-700">
            If you have any questions about this Privacy Policy, You can contact us:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-gray-700">
            <li>By email: geeks.kai@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
