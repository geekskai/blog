import React from "react"

interface FileListProps {
  files: File[]
  progress: { [key: string]: number }
  getFileOutputType: (fileId: string) => "jpeg" | "pdf"
  handleFileOutputChange: (fileId: string, newOutputType: "jpeg" | "pdf") => void
  removeFile: (file: File) => void
  converting: boolean
}

const FileList: React.FC<FileListProps> = ({
  files,
  progress,
  getFileOutputType,
  handleFileOutputChange,
  removeFile,
  converting,
}) => {
  return (
    <div className="space-y-3">
      {[...files].reverse().map((file, index) => (
        <div
          key={index}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/15"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-xl">
                📄
              </div>
              <div>
                <p className="font-medium text-white">{file.name}</p>
                <p className="text-sm text-slate-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Progress Bar */}
              {progress[file.name] > 0 && progress[file.name] < 100 && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${progress[file.name]}%` }}
                      role="progressbar"
                      aria-valuenow={progress[file.name]}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400">{progress[file.name]}%</span>
                </div>
              )}
              {/* Completed Status */}
              {progress[file.name] === 100 && (
                <div className="flex items-center gap-2 rounded-lg bg-green-500/20 px-3 py-1">
                  <span className="text-sm">✅</span>
                  <span className="text-sm font-medium text-green-300">Done</span>
                </div>
              )}
              {/* Output Format Selector */}
              <div className="relative">
                <select
                  className="rounded-lg border border-blue-500/30 bg-blue-500/10 py-1.5 pl-3 pr-8 text-sm text-white backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={getFileOutputType(file.name)}
                  onChange={(e) =>
                    handleFileOutputChange(file.name, e.target.value as "jpeg" | "pdf")
                  }
                  disabled={converting}
                  aria-label="Select output format"
                >
                  <option value="pdf">PDF</option>
                  <option value="jpeg">JPEG</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* Remove Button */}
              <button
                onClick={() => removeFile(file)}
                disabled={converting}
                className={`rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-300 transition-all duration-300 hover:bg-red-500/20 hover:shadow-lg hover:shadow-red-500/25 ${
                  converting ? "cursor-not-allowed opacity-50" : ""
                }`}
                aria-label={`Remove file ${file.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default FileList
