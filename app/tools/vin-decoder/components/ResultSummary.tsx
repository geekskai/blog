"use client"

import React from "react"
import { Car, Calendar, Palette, Settings, MapPin, Shield } from "lucide-react"
import { ResultSummaryProps } from "../types"
import {
  getDisplayValue,
  getVehicleTitle,
  getVehicleSubtitle,
  formatEngineDisplacement,
} from "../lib/mapping"

export default function ResultSummary({ vehicle, onCopy, onShare }: ResultSummaryProps) {
  const title = getVehicleTitle(vehicle)
  const subtitle = getVehicleSubtitle(vehicle)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-600/30 bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 p-10 shadow-2xl backdrop-blur-xl">
      {/* Enhanced Decorative background elements */}
      <div className="from-blue-500/12 via-indigo-500/12 to-purple-500/12 absolute -right-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br blur-3xl" />
      <div className="from-purple-500/12 via-pink-500/12 to-red-500/12 absolute -bottom-20 -left-20 h-36 w-36 animate-pulse rounded-full bg-gradient-to-br blur-3xl" />
      <div className="from-cyan-500/8 to-blue-500/8 absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl" />

      <div className="relative">
        {/* Enhanced Header */}
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h2 className="mb-3 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
              {title}
            </h2>
            {subtitle && <p className="mb-4 text-xl font-semibold text-slate-200">{subtitle}</p>}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-600/30 bg-slate-700/30 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm font-medium text-slate-400">VIN:</span>
              <span className="font-mono text-lg font-bold text-white">{vehicle.vin}</span>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex gap-3">
            {onCopy && (
              <button
                onClick={onCopy}
                className="group relative overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-br from-slate-600/40 to-slate-700/40 px-6 py-3 text-base font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-500/20"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-400/0 via-slate-400/10 to-slate-400/0 transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Copy</span>
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 px-6 py-3 text-base font-medium text-blue-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Share</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Key Specs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Year */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/20">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/25 p-3 shadow-lg shadow-blue-500/20">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-blue-300">Model Year</span>
              </div>
              <p className="text-2xl font-bold text-white">{getDisplayValue(vehicle.year)}</p>
            </div>
          </div>

          {/* Make & Model */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/20">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/25 p-3 shadow-lg shadow-emerald-500/20">
                  <Car className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-emerald-300">Make & Model</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {getDisplayValue(vehicle.make)} {getDisplayValue(vehicle.model, "")}
              </p>
            </div>
          </div>

          {/* Body Type */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/25 p-3 shadow-lg shadow-purple-500/20">
                  <Palette className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-sm font-semibold text-purple-300">Body Class</span>
              </div>
              <p className="text-2xl font-bold text-white">{getDisplayValue(vehicle.bodyClass)}</p>
            </div>
          </div>

          {/* Engine */}
          {vehicle.engine && (
            <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-red-500/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-500/20">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-orange-400/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-orange-500/25 p-3 shadow-lg shadow-orange-500/20">
                    <Settings className="h-6 w-6 text-orange-400" />
                  </div>
                  <span className="text-sm font-semibold text-orange-300">Engine</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {vehicle.engine.cylinders && `${vehicle.engine.cylinders} Cyl`}
                  {vehicle.engine.cylinders &&
                    (vehicle.engine.displacementL || vehicle.engine.displacementCc) &&
                    " • "}
                  {formatEngineDisplacement(
                    vehicle.engine.displacementCc,
                    vehicle.engine.displacementL
                  ) !== "Not available" &&
                    formatEngineDisplacement(
                      vehicle.engine.displacementCc,
                      vehicle.engine.displacementL
                    )}
                </p>
                {vehicle.engine.fuelType && (
                  <p className="mt-2 text-base text-orange-200">{vehicle.engine.fuelType}</p>
                )}
              </div>
            </div>
          )}

          {/* Drive Type */}
          {vehicle.driveType && (
            <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/20">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-cyan-500/25 p-3 shadow-lg shadow-cyan-500/20">
                    <Settings className="h-6 w-6 text-cyan-400" />
                  </div>
                  <span className="text-sm font-semibold text-cyan-300">Drive Type</span>
                </div>
                <p className="text-2xl font-bold text-white">{vehicle.driveType}</p>
              </div>
            </div>
          )}

          {/* Manufacturing */}
          {vehicle.manufacturing && (
            <div className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/15 to-rose-500/10 p-6 backdrop-blur-xl transition-all duration-300 hover:border-pink-400/40 hover:shadow-xl hover:shadow-pink-500/20">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-pink-400/0 via-pink-400/5 to-pink-400/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-pink-500/25 p-3 shadow-lg shadow-pink-500/20">
                    <MapPin className="h-6 w-6 text-pink-400" />
                  </div>
                  <span className="text-sm font-semibold text-pink-300">Manufacturing</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {getDisplayValue(vehicle.manufacturing.plantCountry)}
                </p>
                {vehicle.manufacturing.manufacturerName && (
                  <p className="mt-2 text-base text-pink-200">
                    {vehicle.manufacturing.manufacturerName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Additional Info */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Doors */}
          {vehicle.doors && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-6 py-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10">
              <span className="text-base font-medium text-slate-300">Doors</span>
              <span className="text-lg font-bold text-white">{vehicle.doors}</span>
            </div>
          )}

          {/* Vehicle Type */}
          {vehicle.vehicleType && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-6 py-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10">
              <span className="text-base font-medium text-slate-300">Vehicle Type</span>
              <span className="text-lg font-bold text-white">{vehicle.vehicleType}</span>
            </div>
          )}

          {/* GVWR */}
          {vehicle.gvwr && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-6 py-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10">
              <span className="text-base font-medium text-slate-300">GVWR</span>
              <span className="text-lg font-bold text-white">{vehicle.gvwr}</span>
            </div>
          )}

          {/* Transmission */}
          {vehicle.transmission?.type && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-6 py-4 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10">
              <span className="text-base font-medium text-slate-300">Transmission</span>
              <span className="text-lg font-bold text-white">
                {vehicle.transmission.type}
                {vehicle.transmission.speeds && ` (${vehicle.transmission.speeds} speeds)`}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Safety Features */}
        {vehicle.safety && Object.values(vehicle.safety).some((v) => v) && (
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/15 p-8 backdrop-blur-xl">
            <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 blur-2xl" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-2xl bg-green-500/25 p-4 shadow-lg shadow-green-500/20">
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-2xl font-bold text-transparent">
                  Safety Features
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {vehicle.safety.airbags && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-base font-medium text-green-300">
                        {vehicle.safety.airbags}
                      </span>
                    </div>
                  </div>
                )}
                {vehicle.safety.abs && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-base font-medium text-green-300">
                        ABS: {vehicle.safety.abs}
                      </span>
                    </div>
                  </div>
                )}
                {vehicle.safety.esc && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-base font-medium text-green-300">
                        ESC: {vehicle.safety.esc}
                      </span>
                    </div>
                  </div>
                )}
                {vehicle.safety.tpms && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-6 py-4 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-base font-medium text-green-300">
                        TPMS: {vehicle.safety.tpms}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
