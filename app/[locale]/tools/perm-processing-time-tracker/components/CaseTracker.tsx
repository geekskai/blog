"use client"

import React, { useState } from "react"
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit,
  TrendingUp,
  FileText,
  Eye,
  X,
} from "lucide-react"
import { UserPERMCase, PERMData } from "../types"
import {
  calculateProcessingEstimate,
  formatTimeRemaining,
  getProcessingPriority,
} from "../utils/permDataParser"
import { useTranslations } from "next-intl"

interface CaseTrackerProps {
  cases: UserPERMCase[]
  currentData: PERMData | null
  onAddCase: (
    submissionDate: Date,
    caseType: "analyst" | "audit" | "reconsideration",
    isOEWS: boolean
  ) => void
  onRemoveCase: (caseId: string) => void
  onUpdateCase: (caseId: string, updates: Partial<UserPERMCase>) => void
}

export default function CaseTracker({
  cases,
  currentData,
  onAddCase,
  onRemoveCase,
  onUpdateCase,
}: CaseTrackerProps) {
  const t = useTranslations("PERMProcessingTimeTracker")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCase, setEditingCase] = useState<string | null>(null)
  const [newCase, setNewCase] = useState({
    submissionDate: "",
    caseType: "analyst" as "analyst" | "audit" | "reconsideration",
    isOEWS: false,
  })

  const handleAddCase = () => {
    if (!newCase.submissionDate) return

    const submissionDate = new Date(newCase.submissionDate)
    onAddCase(submissionDate, newCase.caseType, newCase.isOEWS)

    setNewCase({
      submissionDate: "",
      caseType: "analyst",
      isOEWS: false,
    })
    setShowAddForm(false)
  }

  const CaseCard = ({ userCase }: { userCase: UserPERMCase }) => {
    const estimate = currentData
      ? calculateProcessingEstimate(userCase.submissionDate, currentData, userCase.isOEWS)
      : null

    const priority = getProcessingPriority(userCase.submissionDate, userCase.isOEWS)
    const isEditing = editingCase === userCase.id

    const daysSinceSubmission = Math.floor(
      (Date.now() - userCase.submissionDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    return (
      <div className="rounded-xl bg-slate-800/50 p-6 ring-1 ring-slate-700 backdrop-blur-sm transition-all hover:bg-slate-700/50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="rounded-lg bg-blue-500/20 p-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {t("case_tracker.case_number", { id: userCase.id.slice(-8).toUpperCase() })}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {t("case_tracker.submitted")} {userCase.submissionDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priority.color}`}>
                  {priority.level.toUpperCase()}
                </span>
                {userCase.isOEWS && (
                  <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
                    OEWS
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <dl className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <dt className="text-slate-300">{t("case_tracker.submitted_label")}</dt>
                    <dd className="font-medium text-white">
                      <strong>{userCase.submissionDate.toLocaleDateString()}</strong>
                    </dd>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <dt className="text-slate-300">{t("case_tracker.days_pending")}</dt>
                    <dd className="font-medium text-white">
                      <strong>
                        {daysSinceSubmission} {t("case_tracker.days")}
                      </strong>
                    </dd>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <dt className="text-slate-300">{t("case_tracker.queue_type")}</dt>
                    <dd className="font-medium capitalize text-white">
                      <strong>
                        {userCase.caseType} {t("case_tracker.review")}
                      </strong>
                    </dd>
                  </div>
                </dl>
              </div>

              {estimate && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span className="text-slate-300">{t("case_tracker.estimated_completion")}</span>
                  </div>
                  <div className="rounded-lg bg-slate-700/50 p-3">
                    <p className="text-sm font-medium text-white">
                      {estimate.estimatedCompletionDate.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatTimeRemaining(estimate.estimatedCompletionDate)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <span className="text-slate-300">{t("case_tracker.queue_position")}</span>
                    <span className="font-medium text-white">
                      #{estimate.queuePosition.position.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({estimate.queuePosition.percentile}
                      {t("case_tracker.percentile")})
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!estimate && currentData && (
              <div className="mt-4 rounded-lg border border-yellow-800 bg-yellow-900/20 p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-300">
                    {t("case_tracker.unable_to_calculate", { caseType: userCase.caseType })}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="ml-4 flex items-center space-x-2">
            <button
              onClick={() => setEditingCase(isEditing ? null : userCase.id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onRemoveCase(userCase.id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-6" aria-label="Your PERM Cases">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t("case_tracker.title")}</h2>
          <p className="text-sm text-slate-400">
            {t.rich("case_tracker.subtitle", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>{t("case_tracker.add_case")}</span>
        </button>
      </div>

      {/* Add Case Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-xl bg-slate-800 shadow-2xl ring-1 ring-slate-700">
            <div className="border-b border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {t("case_tracker.add_case_title")}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t("case_tracker.submission_date")}
                </label>
                <input
                  type="date"
                  value={newCase.submissionDate}
                  onChange={(e) =>
                    setNewCase((prev) => ({ ...prev, submissionDate: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t("case_tracker.case_type")}
                </label>
                <select
                  value={newCase.caseType}
                  onChange={(e) =>
                    setNewCase((prev) => ({
                      ...prev,
                      caseType: e.target.value as "analyst" | "audit" | "reconsideration",
                    }))
                  }
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="analyst">{t("case_tracker.analyst_review")}</option>
                  <option value="audit">{t("case_tracker.audit_review")}</option>
                  <option value="reconsideration">{t("case_tracker.reconsideration")}</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isOEWS"
                  checked={newCase.isOEWS}
                  onChange={(e) => setNewCase((prev) => ({ ...prev, isOEWS: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isOEWS" className="text-sm text-slate-300">
                  {t("case_tracker.oews_label")}
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
                >
                  {t("case_tracker.cancel")}
                </button>
                <button
                  onClick={handleAddCase}
                  disabled={!newCase.submissionDate}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {t("case_tracker.add_case")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cases List */}
      {cases.length === 0 ? (
        <div className="rounded-xl bg-slate-800/80 p-12 text-center ring-1 ring-slate-700 backdrop-blur-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">
            {t("case_tracker.no_cases_title")}
          </h3>
          <p className="mb-6 text-slate-400">{t("case_tracker.no_cases_description")}</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>{t("case_tracker.add_first_case")}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((userCase) => (
            <CaseCard key={userCase.id} userCase={userCase} />
          ))}
        </div>
      )}

      {/* Summary Statistics */}
      {cases.length > 0 && (
        <article className="rounded-xl bg-slate-800/80 p-6 ring-1 ring-slate-700 backdrop-blur-sm">
          <h3 className="mb-4 font-semibold text-white">{t("case_tracker.summary_title")}</h3>
          <dl className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <dd className="text-2xl font-bold text-blue-400">
                <strong>{cases.length}</strong>
              </dd>
              <dt className="text-sm text-slate-400">{t("case_tracker.total_cases")}</dt>
            </div>
            <div className="text-center">
              <dd className="text-2xl font-bold text-green-400">
                <strong>{cases.filter((c) => c.isOEWS).length}</strong>
              </dd>
              <dt className="text-sm text-slate-400">{t("case_tracker.oews_cases")}</dt>
            </div>
            <div className="text-center">
              <dd className="text-2xl font-bold text-purple-400">
                <strong>
                  {Math.round(
                    cases.reduce((sum, c) => sum + (Date.now() - c.submissionDate.getTime()), 0) /
                      (cases.length * 24 * 60 * 60 * 1000)
                  )}
                </strong>
              </dd>
              <dt className="text-sm text-slate-400">{t("case_tracker.avg_days_pending")}</dt>
            </div>
          </dl>
        </article>
      )}
    </section>
  )
}
