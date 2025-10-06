import React from "react"
import { Shield, Book, Code, AlertTriangle, Car, Wrench } from "lucide-react"

const EducationalContent = () => {
  return (
    <div className="mt-20 space-y-16">
      {/* VIN Structure Section */}
      <section className="rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Vehicle Identification Number (VIN) Structure Guide
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="mb-4 text-slate-200">
              A Vehicle Identification Number (VIN) is a unique 17-character code assigned to every
              motor vehicle when manufactured. It follows the ISO 3779 standard and provides
              detailed information about the vehicle's specifications, manufacturer, and production
              details.
            </p>
            <p className="text-slate-200">
              Our VIN generator creates compliant numbers with valid check digits, making them ideal
              for automotive software testing and development while ensuring they don't correspond
              to real vehicles.
            </p>
          </div>
          <div className="rounded-lg bg-emerald-900/30 p-6">
            <h3 className="mb-3 text-lg font-semibold text-white">VIN Character Positions</h3>
            <ul className="space-y-2 text-slate-200">
              <li>
                • <strong>Positions 1-3:</strong> World Manufacturer Identifier (WMI)
              </li>
              <li>
                • <strong>Positions 4-8:</strong> Vehicle Descriptor Section (VDS)
              </li>
              <li>
                • <strong>Position 9:</strong> Check Digit (validation)
              </li>
              <li>
                • <strong>Position 10:</strong> Model Year
              </li>
              <li>
                • <strong>Position 11:</strong> Plant Code
              </li>
              <li>
                • <strong>Positions 12-17:</strong> Sequential Number
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* VIN Validation */}
      <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          VIN Validation and Check Digit Calculation
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-orange-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-orange-300" />
              <h3 className="text-lg font-semibold text-white">Check Digit Algorithm</h3>
            </div>
            <p className="text-slate-200">
              Position 9 contains a check digit calculated using a specific algorithm that validates
              the authenticity of the entire VIN. Our generator implements the official ISO 3779
              calculation method.
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Car className="h-5 w-5 text-orange-300" />
              <h3 className="text-lg font-semibold text-white">Manufacturer Codes</h3>
            </div>
            <p className="text-slate-200">
              The first three characters identify the manufacturer and country of origin, following
              specific allocation rules managed by the Society of Automotive Engineers (SAE).
            </p>
          </div>
          <div className="rounded-lg bg-orange-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-300" />
              <h3 className="text-lg font-semibold text-white">Year Encoding</h3>
            </div>
            <p className="text-slate-200">
              Position 10 encodes the model year using a specific character mapping that cycles
              every 30 years, excluding certain letters to avoid confusion.
            </p>
          </div>
        </div>
      </section>

      {/* Testing Best Practices */}
      <section className="rounded-xl bg-gradient-to-r from-purple-800 to-pink-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          VIN Testing Best Practices for Developers
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Security First</h3>
            </div>
            <p className="text-slate-200">
              Never use real VINs in testing environments. Always use clearly fake numbers that
              follow format rules but don't correspond to actual vehicles. Our generator ensures
              compliance with this principle.
            </p>
          </div>
          <div className="rounded-lg bg-purple-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Code className="h-5 w-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">Testing Scenarios</h3>
            </div>
            <p className="text-slate-200">
              Test edge cases including invalid characters, incorrect lengths, invalid check digits,
              and boundary conditions. Validate both format compliance and business logic to ensure
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
              between test and production data. Maintain audit trails for automotive compliance
              purposes.
            </p>
          </div>
        </div>
      </section>

      {/* VIN Character Rules */}
      <section className="rounded-xl bg-gradient-to-r from-blue-800 to-indigo-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">VIN Character Rules and Restrictions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Valid VIN Characteristics</h3>
            <ul className="space-y-2 text-slate-200">
              <li>✅ Exactly 17 characters long</li>
              <li>✅ Uses letters A-Z and numbers 0-9</li>
              <li>✅ Excludes letters I, O, Q to avoid confusion</li>
              <li>✅ Check digit matches calculated value</li>
              <li>✅ Valid manufacturer identifier (WMI)</li>
              <li>✅ Proper year code encoding</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Invalid VIN Patterns</h3>
            <ul className="space-y-2 text-slate-200">
              <li>❌ Contains letters I, O, or Q</li>
              <li>❌ Length not exactly 17 characters</li>
              <li>❌ Invalid check digit calculation</li>
              <li>❌ Unrecognized manufacturer code</li>
              <li>❌ Contains special characters or spaces</li>
              <li>❌ Uses lowercase letters</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Common Use Cases for Random VIN Generation
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">🚗 Automotive Testing</h3>
            <p className="text-sm text-slate-200">
              Generate test data for automotive software, vehicle databases, and registration
              systems.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">🏫 Education</h3>
            <p className="text-sm text-slate-200">
              Teaching VIN validation, automotive data structures, and compliance concepts in
              engineering courses.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">🔧 Development</h3>
            <p className="text-sm text-slate-200">
              Populating development databases with realistic vehicle test data for application
              development.
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 p-4">
            <h3 className="mb-2 font-semibold text-white">📊 Analytics</h3>
            <p className="text-sm text-slate-200">
              Creating anonymized vehicle datasets for automotive analytics and reporting system
              development.
            </p>
          </div>
        </div>
      </section>

      {/* Automotive Compliance */}
      <section className="rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Automotive Industry Compliance and Standards
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-green-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">ISO 3779 Standard</h3>
            </div>
            <p className="text-slate-300">
              Our VIN generator follows the ISO 3779 international standard for vehicle
              identification numbers, ensuring compliance with global automotive regulations and
              format requirements.
            </p>
          </div>
          <div className="rounded-lg bg-green-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Data Protection</h3>
            </div>
            <p className="text-slate-300">
              Even fake VINs should be handled with care in development environments. Implement
              proper data protection measures and avoid exposing test data in logs or public
              repositories.
            </p>
          </div>
          <div className="rounded-lg bg-green-900/30 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Ethical Usage</h3>
            </div>
            <p className="text-slate-300">
              Use generated VINs responsibly and transparently. Clearly mark test data as fake,
              educate team members about proper usage, and maintain ethical standards in automotive
              data handling.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EducationalContent
