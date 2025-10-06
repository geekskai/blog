import React from "react"
import { Shield, Book, Code, AlertTriangle } from "lucide-react"

const EducationalContent = () => {
  return (
    <div className="mt-20 space-y-16">
      {/* SSN Structure Section */}
      <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Understanding SSN Structure and Format
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-4 text-slate-200">
              A Social Security Number (SSN) is a nine-digit number in the format XXX-XX-XXXX,
              issued to U.S. citizens, permanent residents, and temporary working residents.
              Understanding its structure is crucial for software developers working with identity
              verification systems.
            </p>
            <p className="text-slate-200">
              Our random SSN generator creates numbers that follow the correct format while ensuring
              they don't correspond to real individuals, making them perfect for testing
              environments and educational purposes.
            </p>
          </div>
          <div className="rounded-lg bg-blue-900/30 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">SSN Format Breakdown</h3>
            <ul className="space-y-2 text-slate-200">
              <li>
                • <strong>Area Number (XXX):</strong> First 3 digits - Geographic region
              </li>
              <li>
                • <strong>Group Number (XX):</strong> Middle 2 digits - Within area subdivision
              </li>
              <li>
                • <strong>Serial Number (XXXX):</strong> Last 4 digits - Individual identifier
              </li>
              <li>
                • <strong>Format:</strong> XXX-XX-XXXX with hyphens
              </li>
              <li>
                • <strong>Total Length:</strong> 9 digits (11 with formatting)
              </li>
              <li>
                • <strong>Character Set:</strong> Numeric digits only (0-9)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testing Best Practices */}
      <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          SSN Testing Best Practices for Developers
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Security First</h3>
            </div>
            <p className="text-slate-200">
              Never use real SSNs in testing environments. Always use clearly fake numbers that
              follow format rules but don't correspond to actual people. Our generator ensures
              compliance with this principle.
            </p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Testing Scenarios</h3>
            </div>
            <p className="text-slate-200">
              Test edge cases including invalid formats, missing digits, special characters, and
              boundary conditions. Validate both format compliance and business logic to ensure
              robust validation.
            </p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Documentation</h3>
            </div>
            <p className="text-slate-200">
              Clearly document test data sources and ensure team members understand the difference
              between test and production data. Maintain audit trails for compliance purposes.
            </p>
          </div>
        </div>
      </section>

      {/* Validation Rules */}
      <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          SSN Validation Rules and Invalid Patterns
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Valid SSN Characteristics</h3>
            <ul className="space-y-2 text-slate-200">
              <li>✅ Area number: 001-899 (excluding 666)</li>
              <li>✅ Group number: 01-99 (not 00)</li>
              <li>✅ Serial number: 0001-9999 (not 0000)</li>
              <li>✅ Proper XXX-XX-XXXX formatting</li>
              <li>✅ No alphabetic characters</li>
              <li>✅ No special characters except hyphens</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Invalid SSN Patterns</h3>
            <ul className="space-y-2 text-slate-200">
              <li>❌ 000-XX-XXXX (area 000 not valid)</li>
              <li>❌ 666-XX-XXXX (area 666 not valid)</li>
              <li>❌ 9XX-XX-XXXX (900-999 reserved)</li>
              <li>❌ XXX-00-XXXX (group 00 not valid)</li>
              <li>❌ XXX-XX-0000 (serial 0000 not valid)</li>
              <li>❌ Any pattern with letters or symbols</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Common Use Cases for Random SSN Generation
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">🧪 QA Testing</h3>
            <p className="text-sm text-slate-200">
              Generate test data for quality assurance testing of forms, databases, and user
              registration systems.
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">🎓 Education</h3>
            <p className="text-sm text-slate-200">
              Teaching data validation, regex patterns, and privacy concepts in computer science
              courses.
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">🔧 Development</h3>
            <p className="text-sm text-slate-200">
              Populating development databases with realistic test data for application development.
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-4">
            <h3 className="mb-2 font-semibold text-white">📊 Analytics</h3>
            <p className="text-sm text-slate-200">
              Creating anonymized datasets for data analysis and reporting system development.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy and Ethics */}
      <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Privacy, Ethics, and Legal Considerations
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Legal Compliance</h3>
            </div>
            <p className="text-slate-300">
              Understand the legal implications of SSN usage in your jurisdiction. Generated numbers
              should only be used for legitimate testing and development purposes, never for fraud
              or impersonation.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Data Protection</h3>
            </div>
            <p className="text-slate-300">
              Even fake SSNs should be handled with care in development environments. Implement
              proper data protection measures and avoid exposing test data in logs or public
              repositories.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Ethical Usage</h3>
            </div>
            <p className="text-slate-300">
              Use generated SSNs responsibly and transparently. Clearly mark test data as fake,
              educate team members about proper usage, and maintain ethical standards in data
              handling.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EducationalContent
