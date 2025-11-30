import React from "react"
import { useDropzone } from "react-dropzone"
import { useTranslations } from "next-intl"

interface DropZoneProps {
  onDrop: (files: File[]) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  error: string | null
}

const DropZone: React.FC<DropZoneProps> = ({ onDrop, fileInputRef, error }) => {
  const t = useTranslations("HeicToPdf")
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/heic": [".heic"] },
    maxSize: 10 * 1024 * 1024,
    multiple: true,
  })

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/25 via-purple-500/20 to-pink-500/25 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative background elements */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-purple-500/15 to-pink-500/15 blur-3xl"></div>

      <div className="relative">
        {/* Title */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-6 py-3 backdrop-blur-sm">
            <span className="text-2xl">📸</span>
            <h2 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent">
              {t("dropzone_title")}
            </h2>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
            getRootProps().isDragActive
              ? "scale-105 border-purple-400 bg-purple-500/20"
              : "border-purple-500/30 bg-purple-500/10 hover:border-purple-400/50 hover:bg-purple-500/15"
          }`}
          {...getRootProps()}
        >
          <input
            {...getInputProps()}
            ref={fileInputRef}
            aria-label={t("dropzone_select_files_aria")}
          />
          <div className="space-y-4">
            <div className="animate-bounce text-6xl">📁</div>
            <div>
              <h3 className="text-xl font-semibold text-white">{t("dropzone_drop_text")}</h3>
              <p className="text-slate-300">{t("dropzone_click_text")}</p>
            </div>
            <button
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-indigo-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/30"
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
              <span className="relative flex items-center gap-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {t("dropzone_upload_button")}
              </span>
            </button>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">{t("dropzone_supported_format")}</p>
              <p className="text-xs text-slate-500">{t("dropzone_local_processing")}</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 backdrop-blur-sm">
            <span className="text-2xl">❌</span>
            <div className="text-left">
              <p className="font-medium text-red-300">{t("dropzone_upload_failed")}</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DropZone
