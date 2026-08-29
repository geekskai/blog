"use client"

import React from "react"
import AccountMenu from "@/components/chrome/AccountMenu"

interface AuthControlsProps {
  mobile?: boolean
  onNavigate?: () => void
}

export default function AuthControls({ mobile = false, onNavigate }: AuthControlsProps) {
  return <AccountMenu variant={mobile ? "dock" : "header"} onNavigate={onNavigate} />
}
