"use client"

import React from "react"
import { Car, Calendar, Palette, Settings, MapPin, Shield } from "lucide-react"
import { useTranslations } from "next-intl"
import { ResultSummaryProps } from "../types"
import {
  getDisplayValue,
  getVehicleTitle,
  getVehicleSubtitle,
  formatEngineDisplacement,
} from "../lib/mapping"

export default function ResultSummary({ vehicle, onCopy, onShare }: ResultSummaryProps) {
  const t = useTranslations("VinDecoder.resultSummary")
  const title = getVehicleTitle(vehicle)
  const subtitle = getVehicleSubtitle(vehicle)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-600/30 bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
      {/* Enhanced Decorative background elements */}
      <div className="from-blue-500/12 via-indigo-500/12 to-purple-500/12 absolute -right-20 -top-20 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br blur-3xl" />
      <div className="from-purple-500/12 via-pink-500/12 to-red-500/12 absolute -bottom-20 -left-20 h-36 w-36 animate-pulse rounded-full bg-gradient-to-br blur-3xl" />
      <div className="from-cyan-500/8 to-blue-500/8 absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl" />

      <div className="relative">
        {/* Enhanced Header */}
        <div className="mb-6 flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h2 className="mb-2 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl lg:text-5xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mb-3 text-base font-semibold text-slate-200 sm:text-lg">{subtitle}</p>
            )}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-slate-600/30 bg-slate-700/30 px-3 py-2 backdrop-blur-sm sm:gap-3 sm:px-4">
              <span className="text-xs font-medium text-slate-400 sm:text-sm">
                {t("vin_label")}
              </span>
              <span className="font-mono text-base font-bold text-white sm:text-lg">
                {vehicle.vin}
              </span>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {onCopy && (
              <button
                onClick={onCopy}
                className="group relative w-full overflow-hidden rounded-2xl border border-slate-500/30 bg-gradient-to-br from-slate-600/40 to-slate-700/40 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-400/50 hover:shadow-lg hover:shadow-slate-500/20 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-slate-400/0 via-slate-400/10 to-slate-400/0 transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{t("copy")}</span>
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="group relative w-full overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 px-4 py-2 text-sm font-medium text-blue-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20 sm:w-auto sm:px-6 sm:py-3 sm:text-base"
              >
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-blue-400/0 transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">{t("share")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Key Specs Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Year */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/15 to-cyan-500/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-500/20 sm:p-6">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div className="rounded-xl bg-blue-500/25 p-2 shadow-lg shadow-blue-500/20 sm:p-3">
                  <Calendar className="h-5 w-5 text-blue-400 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs font-semibold text-blue-300 sm:text-sm">
                  {t("model_year")}
                </span>
              </div>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {getDisplayValue(vehicle.year)}
              </p>
            </div>
          </div>

          {/* Make & Model */}
          <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/20 sm:p-6">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div className="rounded-xl bg-emerald-500/25 p-2 shadow-lg shadow-emerald-500/20 sm:p-3">
                  <Car className="h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs font-semibold text-emerald-300 sm:text-sm">
                  {t("make_model")}
                </span>
              </div>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {getDisplayValue(vehicle.make)} {getDisplayValue(vehicle.model, "")}
              </p>
            </div>
          </div>

          {/* Body Type */}
          <div className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/15 to-pink-500/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/20 sm:p-6">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 transition-transform duration-700 group-hover:translate-x-full" />
            <div className="relative">
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div className="rounded-xl bg-purple-500/25 p-2 shadow-lg shadow-purple-500/20 sm:p-3">
                  <Palette className="h-5 w-5 text-purple-400 sm:h-6 sm:w-6" />
                </div>
                <span className="text-xs font-semibold text-purple-300 sm:text-sm">
                  {t("body_class")}
                </span>
              </div>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {getDisplayValue(vehicle.bodyClass)}
              </p>
            </div>
          </div>

          {/* Engine */}
          {vehicle.engine && (
            <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/15 to-red-500/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-500/20 sm:p-6">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-orange-400/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <div className="rounded-xl bg-orange-500/25 p-2 shadow-lg shadow-orange-500/20 sm:p-3">
                    <Settings className="h-5 w-5 text-orange-400 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs font-semibold text-orange-300 sm:text-sm">
                    {t("engine")}
                  </span>
                </div>
                <p className="text-xl font-bold text-white sm:text-2xl">
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
                  <p className="mt-2 text-sm text-orange-200 sm:text-base">
                    {vehicle.engine.fuelType}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Drive Type */}
          {vehicle.driveType && (
            <div className="group relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-cyan-500/20 sm:p-6">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <div className="rounded-xl bg-cyan-500/25 p-2 shadow-lg shadow-cyan-500/20 sm:p-3">
                    <Settings className="h-5 w-5 text-cyan-400 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs font-semibold text-cyan-300 sm:text-sm">
                    {t("drive_type")}
                  </span>
                </div>
                <p className="text-xl font-bold text-white sm:text-2xl">{vehicle.driveType}</p>
              </div>
            </div>
          )}

          {/* Manufacturing */}
          {vehicle.manufacturing && (
            <div className="group relative overflow-hidden rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/15 to-rose-500/10 p-4 backdrop-blur-xl transition-all duration-300 hover:border-pink-400/40 hover:shadow-xl hover:shadow-pink-500/20 sm:p-6">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-pink-400/0 via-pink-400/5 to-pink-400/0 transition-transform duration-700 group-hover:translate-x-full" />
              <div className="relative">
                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <div className="rounded-xl bg-pink-500/25 p-2 shadow-lg shadow-pink-500/20 sm:p-3">
                    <MapPin className="h-5 w-5 text-pink-400 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs font-semibold text-pink-300 sm:text-sm">
                    {t("manufacturing")}
                  </span>
                </div>
                <p className="text-xl font-bold text-white sm:text-2xl">
                  {getDisplayValue(vehicle.manufacturing.plantCountry)}
                </p>
                {vehicle.manufacturing.manufacturerName && (
                  <p className="mt-2 text-sm text-pink-200 sm:text-base">
                    {vehicle.manufacturing.manufacturerName}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Additional Info */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
          {/* Doors */}
          {vehicle.doors && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10 sm:px-6 sm:py-4">
              <span className="text-sm font-medium text-slate-300 sm:text-base">{t("doors")}</span>
              <span className="text-base font-bold text-white sm:text-lg">{vehicle.doors}</span>
            </div>
          )}

          {/* Vehicle Type */}
          {vehicle.vehicleType && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10 sm:px-6 sm:py-4">
              <span className="text-sm font-medium text-slate-300 sm:text-base">
                {t("vehicle_type")}
              </span>
              <span className="text-base font-bold text-white sm:text-lg">
                {vehicle.vehicleType}
              </span>
            </div>
          )}

          {/* GVWR */}
          {vehicle.gvwr && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10 sm:px-6 sm:py-4">
              <span className="text-sm font-medium text-slate-300 sm:text-base">{t("gvwr")}</span>
              <span className="text-base font-bold text-white sm:text-lg">{vehicle.gvwr}</span>
            </div>
          )}

          {/* Transmission */}
          {vehicle.transmission?.type && (
            <div className="group flex items-center justify-between rounded-2xl border border-slate-600/20 bg-gradient-to-r from-slate-700/30 to-slate-800/30 px-4 py-3 backdrop-blur-xl transition-all duration-300 hover:border-slate-500/40 hover:shadow-lg hover:shadow-slate-500/10 sm:px-6 sm:py-4">
              <span className="text-sm font-medium text-slate-300 sm:text-base">
                {t("transmission")}
              </span>
              <span className="text-base font-bold text-white sm:text-lg">
                {vehicle.transmission.type}
                {vehicle.transmission.speeds && ` (${vehicle.transmission.speeds} ${t("speeds")})`}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Safety Features */}
        {vehicle.safety && Object.values(vehicle.safety).some((v) => v) && (
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-teal-500/15 p-5 backdrop-blur-xl sm:mt-10 sm:p-8">
            <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 blur-2xl" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <div className="rounded-2xl bg-green-500/25 p-3 shadow-lg shadow-green-500/20 sm:p-4">
                  <Shield className="h-6 w-6 text-green-400 sm:h-8 sm:w-8" />
                </div>
                <h3 className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                  {t("safety_features")}
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {vehicle.safety.airbags && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-green-300 sm:text-base">
                        {vehicle.safety.airbags}
                      </span>
                    </div>
                  </div>
                )}
                {vehicle.safety.abs && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-green-300 sm:text-base">
                        {t("abs")}: {vehicle.safety.abs}
                      </span>
                    </div>
                  </div>
                )}
                {vehicle.safety.esc && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-green-300 sm:text-base">
                        {t("esc")}: {vehicle.safety.esc}
                      </span>
                    </div>
                  </div>
                )}
                {vehicle.safety.tpms && (
                  <div className="group rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-green-400/40 hover:bg-green-500/20 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                      <span className="text-sm font-medium text-green-300 sm:text-base">
                        {t("tpms")}: {vehicle.safety.tpms}
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
