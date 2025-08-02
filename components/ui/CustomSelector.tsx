"use client"

import { useState, Fragment, useRef, useEffect } from "react"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDown, Check, Search, Globe, X } from "lucide-react"

interface SelectorOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  group?: string
}

interface CustomSelectorProps {
  options: SelectorOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  maxHeight?: string
}

export default function CustomSelector({
  options,
  value,
  onChange,
  className = "",
  placeholder = "Select an option",
  searchable = true,
  clearable = false,
  disabled = false,
  icon,
  maxHeight = "max-h-64",
}: CustomSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Group options by group if specified
  const groupedOptions = options.reduce(
    (acc, option) => {
      const group = option.group || "default"
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(option)
      return acc
    },
    {} as Record<string, SelectorOption[]>
  )

  // Filter options based on search query
  const filteredOptions = searchQuery
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  // Get selected option
  const selectedOption = options.find((option) => option.value === value)

  // Focus search input when popover opens
  const focusSearchInput = () => {
    if (searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const handleSelect = (optionValue: string, close: () => void) => {
    onChange(optionValue)
    close()
    setSearchQuery("")
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    setSearchQuery("")
  }

  const renderOption = (option: SelectorOption, isSelected: boolean, close: () => void) => (
    <button
      key={option.value}
      onClick={() => handleSelect(option.value, close)}
      className={`w-full rounded-lg px-3 py-2.5 text-left transition-all ${
        isSelected
          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white ring-1 ring-blue-500/30"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {option.icon && (
            <div className="flex h-5 w-5 items-center justify-center text-slate-400">
              {option.icon}
            </div>
          )}
          <div className="flex-1">
            <div className="font-medium">{option.label}</div>
            {option.description && (
              <div className="text-xs text-slate-400">{option.description}</div>
            )}
          </div>
        </div>
        {isSelected && <Check className="h-4 w-4 text-blue-400" />}
      </div>
    </button>
  )

  const renderGroupedOptions = (close: () => void) => {
    if (searchQuery) {
      // When searching, show flat list
      return filteredOptions.map((option) => renderOption(option, option.value === value, close))
    }

    // Show grouped options
    return Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
      <div key={groupName}>
        {groupName !== "default" && (
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {groupName}
          </div>
        )}
        <div className="space-y-1">
          {groupOptions.map((option) => renderOption(option, option.value === value, close))}
        </div>
        {groupName !== "default" && <div className="my-2 border-t border-white/10" />}
      </div>
    ))
  }

  return (
    <Popover className="relative">
      {({ open, close }) => {
        // Clear search when popover closes
        if (!open && searchQuery) {
          setSearchQuery("")
        }

        return (
          <>
            <Popover.Button
              disabled={disabled}
              className={`w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-left text-white backdrop-blur-sm transition-all ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-white/10 focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {icon && (
                    <div className="flex h-5 w-5 items-center justify-center text-slate-400">
                      {icon}
                    </div>
                  )}
                  <div className="flex-1">
                    {selectedOption ? (
                      <div>
                        <div className="font-medium">{selectedOption.label}</div>
                        {selectedOption.description && (
                          <div className="text-xs text-slate-400">{selectedOption.description}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">{placeholder}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {clearable && selectedOption && !disabled && (
                    <button
                      onClick={handleClear}
                      className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              afterEnter={focusSearchInput}
            >
              <Popover.Panel className="absolute left-0 right-0 z-[99999] mt-2 w-full transform sm:left-auto sm:right-auto sm:w-80">
                {/* Background overlay */}
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-md">
                  {/* Search Input */}
                  {searchable && (
                    <div className="border-b border-white/10 p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search options..."
                          className="w-full rounded-lg bg-white/10 py-2 pl-10 pr-3 text-white placeholder-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Options List */}
                  <div className={`${maxHeight} overflow-y-auto p-2`}>
                    {searchQuery && filteredOptions.length === 0 ? (
                      <div className="px-3 py-8 text-center text-slate-400">
                        <Search className="mx-auto mb-2 h-8 w-8 text-slate-500" />
                        <p className="text-sm">No options found</p>
                        <p className="text-xs text-slate-500">Try adjusting your search terms</p>
                      </div>
                    ) : (
                      <div className="space-y-1">{renderGroupedOptions(close)}</div>
                    )}
                  </div>

                  {/* Footer */}
                  {options.length > 10 && (
                    <div className="border-t border-white/10 px-3 py-2">
                      <p className="text-xs text-slate-500">
                        {searchQuery
                          ? `${filteredOptions.length} of ${options.length} options`
                          : `${options.length} options available`}
                      </p>
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )
      }}
    </Popover>
  )
}
