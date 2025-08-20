import React from "react"
import { AlertTriangle, Shield } from "lucide-react"

const LegalDisclaimer = () => {
  return (
    <section className="rounded-xl bg-gradient-to-r from-orange-800 to-red-700 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        SSN Generator Legal Notice and Usage Guidelines
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">✅ Approved Uses</h3>
          <ul className="space-y-2 text-slate-200">
            <li>✅ Software testing and development</li>
            <li>✅ Educational research and training</li>
            <li>✅ Database population for demos</li>
            <li>✅ Application validation testing</li>
            <li>✅ Developer tool integration</li>
            <li>✅ Academic coursework examples</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">❌ Prohibited Uses</h3>
          <ul className="space-y-2 text-slate-200">
            <li>❌ Identity fraud or impersonation</li>
            <li>❌ Illegal financial transactions</li>
            <li>❌ Government benefit fraud</li>
            <li>❌ Credit application deception</li>
            <li>❌ Employment verification fraud</li>
            <li>❌ Any real-world impersonation</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 rounded-lg bg-red-900/30 p-4">
        <p className="text-sm text-slate-200">
          <strong className="text-red-300">Legal Disclaimer:</strong> Generated SSN numbers are
          completely random and do not correspond to real individuals. Users are solely responsible
          for ensuring compliance with applicable laws and regulations in their jurisdiction.
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
      <li>✅ Software testing and QA</li>
      <li>✅ Database development</li>
      <li>✅ Educational research</li>
      <li>✅ Mock data generation</li>
      <li>✅ Application development</li>
      <li>✅ Form validation testing</li>
    </ul>

    <div className="mb-3 flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-red-400" />
      <h4 className="font-medium text-red-300">Prohibited Uses</h4>
    </div>
    <ul className="space-y-1 text-sm text-slate-300">
      <li>❌ Identity fraud or theft</li>
      <li>❌ Financial fraud</li>
      <li>❌ Impersonation</li>
      <li>❌ Government benefit fraud</li>
      <li>❌ Credit applications</li>
      <li>❌ Any illegal activities</li>
    </ul>
  </div>
)

export default LegalDisclaimer
