import React from "react"

interface HeaderControlsProps {
  fileInputRef: React.RefObject<HTMLInputElement>
  onDrop: (files: File[]) => void
  removeAllFiles: () => void
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  fileInputRef,
  onDrop,
  removeAllFiles,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="group relative overflow-hidden rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-blue-300 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
          <span className="relative flex items-center gap-2">
            <svg
              className="h-4 w-4"
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
            Add More Files
          </span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) {
                onDrop(Array.from(e.target.files))
              }
            }}
            className="hidden"
            accept=".heic"
            multiple
            aria-label="Select more HEIC files"
          />
        </button>
        <button
          onClick={removeAllFiles}
          className="group relative overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/10 to-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
          aria-label="Clear file list"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 transition-transform duration-700 group-hover:translate-x-full"></div>
          <span className="relative flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear All
          </span>
        </button>
      </div>
    </div>
  )
}

export default HeaderControls
