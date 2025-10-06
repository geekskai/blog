"use client"

import { useState, useCallback } from "react"
import { Plus, Trash2, Edit3, Download, Copy, Check, AlertCircle, Package } from "lucide-react"
import { useTranslations } from "next-intl"
import type { Project, LumberPiece, LengthUnit, CopyStatus } from "../types"
import {
  calculateBoardFeet,
  formatNumber,
  formatCurrency,
  getUnitSymbol,
} from "../utils/calculator"
import { copyToClipboard, formatProject, downloadProjectAsCSV } from "../utils/clipboard"

interface ProjectManagerProps {
  className?: string
  defaultProject?: Partial<Project>
}

export default function ProjectManager({ className = "", defaultProject }: ProjectManagerProps) {
  const t = useTranslations("BoardFootCalculator.project_manager")
  // 项目状态
  const [project, setProject] = useState<Project>({
    id: crypto.randomUUID(),
    name: defaultProject?.name || t("project_name"),
    pieces: defaultProject?.pieces || [],
    totalBoardFeet: 0,
    totalCost: 0,
    wastePercentage: defaultProject?.wastePercentage || 10,
    taxRate: defaultProject?.taxRate || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // UI 状态
  const [isAddingPiece, setIsAddingPiece] = useState(false)
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null)
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle")

  // 新木材件表单状态
  const [newPiece, setNewPiece] = useState<Partial<LumberPiece>>({
    name: "",
    dimensions: {
      length: 8,
      width: 4,
      thickness: 1,
      unit: "inches" as LengthUnit,
    },
    quantity: 1,
    pricePerBoardFoot: 3.5,
  })

  // 计算项目总计
  const calculateProjectTotals = useCallback((pieces: LumberPiece[]) => {
    const totalBoardFeet = pieces.reduce((sum, piece) => sum + piece.totalBoardFeet, 0)
    const totalCost = pieces.reduce((sum, piece) => sum + piece.totalCost, 0)

    return { totalBoardFeet, totalCost }
  }, [])

  // 创建木材件
  const createLumberPiece = useCallback(
    (pieceData: Partial<LumberPiece>): LumberPiece => {
      const dimensions = pieceData.dimensions!
      const quantity = pieceData.quantity || 1
      const pricePerBoardFoot = pieceData.pricePerBoardFoot || 0

      const boardFeet = calculateBoardFeet(dimensions, 3)
      const totalBoardFeet = boardFeet * quantity
      const cost = boardFeet * pricePerBoardFoot
      const totalCost = cost * quantity

      return {
        id: crypto.randomUUID(),
        name: pieceData.name || t("untitled_piece"),
        dimensions,
        quantity,
        pricePerBoardFoot,
        boardFeet,
        totalBoardFeet,
        cost,
        totalCost,
      }
    },
    [t]
  )

  // 添加木材件
  const handleAddPiece = useCallback(() => {
    if (!newPiece.dimensions || !newPiece.name) return

    const piece = createLumberPiece(newPiece)
    const updatedPieces = [...project.pieces, piece]
    const totals = calculateProjectTotals(updatedPieces)

    setProject((prev) => ({
      ...prev,
      pieces: updatedPieces,
      ...totals,
      updatedAt: new Date(),
    }))

    // 重置表单
    setNewPiece({
      name: "",
      dimensions: {
        length: 8,
        width: 4,
        thickness: 1,
        unit: "inches" as LengthUnit,
      },
      quantity: 1,
      pricePerBoardFoot: 3.5,
    })
    setIsAddingPiece(false)
  }, [newPiece, project.pieces, createLumberPiece, calculateProjectTotals])

  // 删除木材件
  const handleDeletePiece = useCallback(
    (pieceId: string) => {
      const updatedPieces = project.pieces.filter((piece) => piece.id !== pieceId)
      const totals = calculateProjectTotals(updatedPieces)

      setProject((prev) => ({
        ...prev,
        pieces: updatedPieces,
        ...totals,
        updatedAt: new Date(),
      }))
    },
    [project.pieces, calculateProjectTotals]
  )

  // 更新木材件
  const handleUpdatePiece = useCallback(
    (pieceId: string, updates: Partial<LumberPiece>) => {
      const updatedPieces = project.pieces.map((piece) => {
        if (piece.id === pieceId) {
          const updatedPiece = { ...piece, ...updates }

          // 重新计算板英尺和成本
          const boardFeet = calculateBoardFeet(updatedPiece.dimensions, 3)
          const totalBoardFeet = boardFeet * updatedPiece.quantity
          const cost = boardFeet * (updatedPiece.pricePerBoardFoot || 0)
          const totalCost = cost * updatedPiece.quantity

          return {
            ...updatedPiece,
            boardFeet,
            totalBoardFeet,
            cost,
            totalCost,
          }
        }
        return piece
      })

      const totals = calculateProjectTotals(updatedPieces)

      setProject((prev) => ({
        ...prev,
        pieces: updatedPieces,
        ...totals,
        updatedAt: new Date(),
      }))
    },
    [project.pieces, calculateProjectTotals]
  )

  // 复制项目信息
  const handleCopyProject = useCallback(async () => {
    setCopyStatus("copying")

    const copyText = formatProject(project)
    const success = await copyToClipboard(copyText)
    setCopyStatus(success ? "copied" : "error")

    setTimeout(() => setCopyStatus("idle"), 2000)
  }, [project])

  // 下载CSV
  const handleDownloadCSV = useCallback(() => {
    downloadProjectAsCSV(project)
  }, [project])

  // 计算含废料和税费的总计
  const totalWithWaste = project.totalBoardFeet * (1 + project.wastePercentage / 100)
  const totalWithTax = project.totalCost * (1 + project.taxRate / 100)

  // 获取复制按钮内容
  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case "copying":
        return {
          icon: (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ),
          text: t("copying"),
        }
      case "copied":
        return { icon: <Check className="h-4 w-4" />, text: t("copied") }
      case "error":
        return { icon: <AlertCircle className="h-4 w-4" />, text: t("failed") }
      default:
        return { icon: <Copy className="h-4 w-4" />, text: t("copy_project") }
    }
  }

  const copyButtonContent = getCopyButtonContent()

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/25 via-indigo-900/20 to-purple-900/25 p-8 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {/* 装饰性背景元素 */}
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/15 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/15 to-purple-500/15 blur-3xl" />

      <div className="relative">
        {/* 标题区域 */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-3 backdrop-blur-sm">
            <Package className="h-5 w-5 text-blue-400" />
            <h3 className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-xl font-bold text-transparent">
              {t("title")}
            </h3>
          </div>
          <p className="text-slate-300">{t("description")}</p>
        </div>

        {/* 项目信息 */}
        <div className="mb-6 space-y-4">
          {/* 项目名称 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              {t("project_name")}
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) =>
                setProject((prev) => ({ ...prev, name: e.target.value, updatedAt: new Date() }))
              }
              className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* 废料和税率设置 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t("waste_percentage")}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={project.wastePercentage}
                onChange={(e) =>
                  setProject((prev) => ({
                    ...prev,
                    wastePercentage: parseFloat(e.target.value) || 0,
                    updatedAt: new Date(),
                  }))
                }
                className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                {t("tax_rate")}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={project.taxRate}
                onChange={(e) =>
                  setProject((prev) => ({
                    ...prev,
                    taxRate: parseFloat(e.target.value) || 0,
                    updatedAt: new Date(),
                  }))
                }
                className="w-full rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>
        </div>

        {/* 添加新木材件按钮 */}
        {!isAddingPiece && (
          <button
            onClick={() => setIsAddingPiece(true)}
            className="mb-6 w-full rounded-2xl border-2 border-dashed border-slate-600 bg-slate-800/30 py-4 text-slate-400 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
          >
            <div className="flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              <span>{t("add_lumber_piece")}</span>
            </div>
          </button>
        )}

        {/* 添加木材件表单 */}
        {isAddingPiece && (
          <div className="mb-6 rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
            <h4 className="mb-4 text-lg font-semibold text-white">{t("add_new_lumber_piece")}</h4>

            <div className="space-y-4">
              {/* 名称 */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  {t("piece_name")}
                </label>
                <input
                  type="text"
                  value={newPiece.name || ""}
                  onChange={(e) => setNewPiece((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={t("piece_name_placeholder")}
                  className="w-full rounded-xl border border-slate-500/30 bg-slate-700/30 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* 尺寸 */}
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("length")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPiece.dimensions?.length || ""}
                    onChange={(e) =>
                      setNewPiece((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions!,
                          length: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("width")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPiece.dimensions?.width || ""}
                    onChange={(e) =>
                      setNewPiece((prev) => ({
                        ...prev,
                        dimensions: { ...prev.dimensions!, width: parseFloat(e.target.value) || 0 },
                      }))
                    }
                    className="w-full rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("thickness")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPiece.dimensions?.thickness || ""}
                    onChange={(e) =>
                      setNewPiece((prev) => ({
                        ...prev,
                        dimensions: {
                          ...prev.dimensions!,
                          thickness: parseFloat(e.target.value) || 0,
                        },
                      }))
                    }
                    className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("unit")}
                  </label>
                  <select
                    value={newPiece.dimensions?.unit || "inches"}
                    onChange={(e) =>
                      setNewPiece((prev) => ({
                        ...prev,
                        dimensions: { ...prev.dimensions!, unit: e.target.value as LengthUnit },
                      }))
                    }
                    className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-white backdrop-blur-sm transition-all duration-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="inches">{t("inches")}</option>
                    <option value="feet">{t("feet")}</option>
                    <option value="cm">{t("centimeters")}</option>
                    <option value="meters">{t("meters")}</option>
                  </select>
                </div>
              </div>

              {/* 数量和价格 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("quantity")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={newPiece.quantity || ""}
                    onChange={(e) =>
                      setNewPiece((prev) => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    {t("price_per_board_foot_label")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPiece.pricePerBoardFoot || ""}
                    onChange={(e) =>
                      setNewPiece((prev) => ({
                        ...prev,
                        pricePerBoardFoot: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-300 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
              </div>

              {/* 按钮 */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddPiece}
                  disabled={!newPiece.name || !newPiece.dimensions}
                  className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:from-green-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("add_piece")}
                </button>
                <button
                  onClick={() => setIsAddingPiece(false)}
                  className="flex-1 rounded-xl bg-slate-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-slate-700"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 木材件列表 */}
        {project.pieces.length > 0 && (
          <div className="mb-6 space-y-3">
            <h4 className="text-lg font-semibold text-white">
              {t("lumber_pieces_count", { count: project.pieces.length })}
            </h4>

            {project.pieces.map((piece) => (
              <div key={piece.id} className="rounded-xl bg-slate-800/30 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-white">{piece.name}</h5>
                    <div className="mt-1 text-sm text-slate-300">
                      <span>
                        {formatNumber(piece.dimensions.length, 2)} ×{" "}
                        {formatNumber(piece.dimensions.width, 2)} ×{" "}
                        {formatNumber(piece.dimensions.thickness, 2)}{" "}
                        {getUnitSymbol(piece.dimensions.unit)}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {t("qty_label")} {piece.quantity}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {formatNumber(piece.totalBoardFeet, 3)} {t("bf_unit")}
                      </span>
                      {piece.pricePerBoardFoot !== undefined && piece.pricePerBoardFoot > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{formatCurrency(piece.totalCost)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPieceId(piece.id)}
                      className="rounded-lg bg-blue-500/20 p-2 text-blue-400 transition-all duration-300 hover:bg-blue-500/30"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePiece(piece.id)}
                      className="rounded-lg bg-red-500/20 p-2 text-red-400 transition-all duration-300 hover:bg-red-500/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 项目总计 */}
        {project.pieces.length > 0 && (
          <div className="mb-6 rounded-2xl bg-slate-800/30 p-6 backdrop-blur-sm">
            <h4 className="mb-4 text-lg font-semibold text-white">{t("project_totals")}</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t("total_board_feet")}</span>
                <span className="text-xl font-bold text-white">
                  {formatNumber(project.totalBoardFeet, 3)}
                </span>
              </div>

              {project.wastePercentage > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {t("with_waste", { percentage: project.wastePercentage })}
                  </span>
                  <span className="text-lg font-semibold text-orange-400">
                    {formatNumber(totalWithWaste, 3)} {t("bf_unit")}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-300">{t("total_cost")}</span>
                <span className="text-xl font-bold text-green-400">
                  {formatCurrency(project.totalCost)}
                </span>
              </div>

              {project.taxRate > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {t("with_tax", { percentage: project.taxRate })}
                  </span>
                  <span className="text-lg font-semibold text-green-400">
                    {formatCurrency(totalWithTax)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        {project.pieces.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            <button
              onClick={handleCopyProject}
              disabled={copyStatus === "copying"}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {copyButtonContent.icon}
              <span>{copyButtonContent.text}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-green-700 hover:to-emerald-700"
            >
              <Download className="h-4 w-4" />
              <span>{t("download_csv")}</span>
            </button>
          </div>
        )}

        {/* 空状态 */}
        {project.pieces.length === 0 && !isAddingPiece && (
          <div className="py-12 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-slate-500" />
            <h4 className="mb-2 text-lg font-semibold text-slate-400">{t("no_lumber_pieces")}</h4>
            <p className="text-slate-500">{t("add_first_piece")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
