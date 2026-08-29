"use client"

import React from "react"
import Link from "next/link"

type AuthLegalConsentProps = {
  accepted: boolean
  onAcceptedChange: (accepted: boolean) => void
}

export default function AuthLegalConsent({ accepted, onAcceptedChange }: AuthLegalConsentProps) {
  const id = "auth-legal-sign-up"

  return (
    <div
      className={`rounded-lg border p-3 transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none md:p-3.5 ${
        accepted
          ? "border-sky-400/15 bg-sky-950/20"
          : "border-amber-400/30 bg-amber-950/15 ring-2 ring-amber-400/10"
      }`}
    >
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 md:gap-3">
        <input
          id={id}
          type="checkbox"
          checked={accepted}
          onChange={(event) => onAcceptedChange(event.target.checked)}
          className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer rounded-[0.3rem] border-slate-600 bg-slate-950 text-sky-500 accent-sky-500 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-950"
        />
        <span className="text-left text-xs leading-5 text-slate-300 md:text-[13px] md:leading-5">
          I agree to the{" "}
          <Link
            href="/terms/"
            className="font-semibold text-sky-300 underline-offset-2 transition-colors hover:text-sky-200 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy/"
            className="font-semibold text-sky-300 underline-offset-2 transition-colors hover:text-sky-200 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
    </div>
  )
}
