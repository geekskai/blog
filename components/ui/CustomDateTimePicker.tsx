"use client"

import { useState, Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import { Calendar, ChevronLeft, ChevronRight, Clock, ArrowUp, ArrowDown } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns"

interface CustomDateTimePickerProps {
  value: Date
  onChange: (date: Date) => void
  className?: string
  placeholder?: string
}

export default function CustomDateTimePicker({
  value,
  onChange,
  className = "",
  placeholder = "Select date and time",
}: CustomDateTimePickerProps) {
  const [viewDate, setViewDate] = useState(value)

  // Get calendar days for current view
  const monthStart = startOfMonth(viewDate)
  const monthEnd = endOfMonth(viewDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Fill the calendar grid with empty days from previous month
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()))

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const handleDateSelect = (selectedDate: Date) => {
    const newDate = new Date(selectedDate)
    newDate.setHours(value.getHours())
    newDate.setMinutes(value.getMinutes())
    onChange(newDate)
  }

  const handleTimeChange = (type: "hours" | "minutes", increment: boolean) => {
    const newDate = new Date(value)
    if (type === "hours") {
      const newHours = increment
        ? (newDate.getHours() + 1) % 24
        : (newDate.getHours() - 1 + 24) % 24
      newDate.setHours(newHours)
    } else {
      const newMinutes = increment
        ? (newDate.getMinutes() + 1) % 60
        : (newDate.getMinutes() - 1 + 60) % 60
      newDate.setMinutes(newMinutes)
    }
    onChange(newDate)
  }

  const setQuickTime = (hours: number, minutes: number) => {
    const newDate = new Date(value)
    newDate.setHours(hours, minutes, 0, 0)
    onChange(newDate)
  }

  const setToday = () => {
    const today = new Date()
    today.setHours(value.getHours(), value.getMinutes(), 0, 0)
    onChange(today)
    setViewDate(today)
  }

  const setNow = () => {
    onChange(new Date())
    setViewDate(new Date())
  }

  return (
    <div className="relative">
      <Popover className="relative">
        {({ open, close }) => (
          <>
            <Popover.Button
              className={`w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-left text-white backdrop-blur-sm transition-all hover:bg-white/10 focus:border-blue-500 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/50 ${className}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{format(value, "MMM dd, yyyy HH:mm")}</span>
                </span>
                <Clock className="h-4 w-4 text-slate-400" />
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
            >
              <Popover.Panel className="absolute left-0 right-0 z-[99999] mt-3 w-96 max-w-sm transform sm:left-auto sm:right-auto sm:w-80">
                {/* Background overlay */}
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                  style={{ zIndex: -1 }}
                />
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-md">
                  {/* Header */}
                  <div className="border-b border-white/10 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setViewDate(subMonths(viewDate, 1))}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <h3 className="text-lg font-semibold text-white">
                        {format(viewDate, "MMMM yyyy")}
                      </h3>

                      <button
                        onClick={() => setViewDate(addMonths(viewDate, 1))}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Calendar Grid */}
                    <div className="mb-4">
                      <div className="mb-2 grid grid-cols-7 gap-1 text-xs text-slate-400">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                          <div key={day} className="p-2 text-center font-medium">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, dayIdx) => {
                          const isCurrentMonth = isSameMonth(day, viewDate)
                          const isSelected = isSameDay(day, value)
                          const isToday = isSameDay(day, new Date())

                          return (
                            <button
                              key={dayIdx}
                              onClick={() => handleDateSelect(day)}
                              className={`relative rounded-lg p-2 text-sm transition-all ${
                                isSelected
                                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                  : isToday
                                    ? "bg-white/10 font-semibold text-white"
                                    : isCurrentMonth
                                      ? "text-slate-300 hover:bg-white/10 hover:text-white"
                                      : "text-slate-600 hover:bg-white/5"
                              }`}
                            >
                              {format(day, "d")}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Selection */}
                    <div className="rounded-lg bg-white/5 p-4">
                      <div className="mb-3 flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Time</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Hours */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleTimeChange("hours", true)}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="23"
                            value={value.getHours()}
                            onChange={(e) => {
                              const hours = Math.max(0, Math.min(23, parseInt(e.target.value) || 0))
                              const newDate = new Date(value)
                              newDate.setHours(hours)
                              onChange(newDate)
                            }}
                            className="mx-2 w-12 rounded-lg bg-white/10 px-2 py-2 text-center font-mono text-lg text-white [appearance:textfield] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => handleTimeChange("hours", false)}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-xl text-slate-400">:</span>

                        {/* Minutes */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleTimeChange("minutes", true)}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={value.getMinutes()}
                            onChange={(e) => {
                              const minutes = Math.max(
                                0,
                                Math.min(59, parseInt(e.target.value) || 0)
                              )
                              const newDate = new Date(value)
                              newDate.setMinutes(minutes)
                              onChange(newDate)
                            }}
                            className="mx-2 w-12 rounded-lg bg-white/10 px-2 py-2 text-center font-mono text-lg text-white [appearance:textfield] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => handleTimeChange("minutes", false)}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Time Buttons */}
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        <button
                          onClick={() => setQuickTime(9, 0)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                          9:00
                        </button>
                        <button
                          onClick={() => setQuickTime(12, 0)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                          12:00
                        </button>
                        <button
                          onClick={() => setQuickTime(18, 0)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                          18:00
                        </button>
                        <button
                          onClick={() => setQuickTime(21, 0)}
                          className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                        >
                          21:00
                        </button>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={setToday}
                        className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-slate-300 transition-all hover:bg-white/10 hover:text-white"
                      >
                        Today
                      </button>
                      <button
                        onClick={setNow}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-2 text-sm font-medium text-white transition-all hover:scale-[1.02]"
                      >
                        Now
                      </button>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
