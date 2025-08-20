import React from "react"
import { AlertTriangle, Shield } from "lucide-react"

const LegalDisclaimer = () => {
  return (
    <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        VIN Generator Legal Notice and Usage Guidelines
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">✅ Approved Uses</h3>
          <ul className="space-y-2 text-slate-200">
            <li>✅ Automotive software testing</li>
            <li>✅ Vehicle database development</li>
            <li>✅ Educational automotive research</li>
            <li>✅ Application validation testing</li>
            <li>✅ Developer tool integration</li>
            <li>✅ Academic automotive coursework</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">❌ Prohibited Uses</h3>
          <ul className="space-y-2 text-slate-200">
            <li>❌ Vehicle fraud or title washing</li>
            <li>❌ Illegal vehicle transactions</li>
            <li>❌ Insurance fraud schemes</li>
            <li>❌ Registration deception</li>
            <li>❌ VIN cloning activities</li>
            <li>❌ Any real vehicle impersonation</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-red-900/30 p-4">
        <p className="text-sm text-slate-200">
          <strong className="text-red-300">Legal Disclaimer:</strong> Generated VIN numbers are ISO
          3779 compliant but completely random and do not correspond to real vehicles. Users are
          solely responsible for ensuring compliance with automotive regulations in their
          jurisdiction.
        </p>
      </div>
    </section>
  )
}

export const UsageRestrictions = () => (
  <div className="mt-6 rounded-lg bg-slate-800 p-4">
    <div className="mb-3 flex items-center gap-3">
      <Shield className="h-5 w-5 text-green-400" />
      <h4 className="font-medium text-green-300">Approved Uses</h4>
    </div>
    <ul className="mb-4 space-y-1 text-sm text-slate-300">
      <li>✅ Automotive software testing</li>
      <li>✅ Database development</li>
      <li>✅ Educational research</li>
      <li>✅ VIN validation testing</li>
      <li>✅ Application development</li>
      <li>✅ Form validation testing</li>
    </ul>

    <div className="mb-3 flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-red-400" />
      <h4 className="font-medium text-red-300">Prohibited Uses</h4>
    </div>
    <ul className="space-y-1 text-sm text-slate-300">
      <li>❌ Vehicle fraud or theft</li>
      <li>❌ Insurance fraud</li>
      <li>❌ Title forgery</li>
      <li>❌ Registration fraud</li>
      <li>❌ Sales misrepresentation</li>
      <li>❌ Any illegal activities</li>
    </ul>
  </div>
)

export default LegalDisclaimer
