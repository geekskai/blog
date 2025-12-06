"use client"

import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { useTranslations } from "next-intl"

interface ImageUploadProps {
  value: string | null
  onChange: (value: string | null) => void
  onRemove?: () => void
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onRemove }) => {
  const t = useTranslations("InvincibleTitleCardGenerator")

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onChange(result)
        }
        reader.onerror = () => {
          console.error("Failed to read file")
        }
        reader.readAsDataURL(file)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    onRemove?.()
  }

  if (value) {
    return (
      <div className="group relative">
        <div className="relative overflow-hidden rounded-xl border-2 border-white/20">
          <img src={value} alt="Uploaded background" className="h-32 w-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-red-500/90 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
            aria-label={t("settings.remove_image")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">{t("settings.uploaded_image")}</p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 ${
        isDragActive
          ? "scale-105 border-blue-400 bg-blue-500/20"
          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-full bg-blue-500/20 p-3">
          {isDragActive ? (
            <Upload className="h-6 w-6 text-blue-400" />
          ) : (
            <ImageIcon className="h-6 w-6 text-slate-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-300">
            {isDragActive ? t("settings.drop_image_here") : t("settings.click_or_drag_image")}
          </p>
          <p className="mt-1 text-xs text-slate-500">{t("settings.image_formats")} (Max 10MB)</p>
        </div>
      </div>
    </div>
  )
}
