"use client"

import React from "react"
import { SignIn, SignUp, useAuth } from "@clerk/nextjs"
import Link from "next/link"
import { useState } from "react"
import { authClerkAppearance } from "@/lib/auth/clerk-appearance"
import AuthLegalConsent from "./AuthLegalConsent"

type AuthClerkPanelProps = {
  mode: "sign-in" | "sign-up"
  redirectUrl: string
  alternateAuthUrl: string
  alternateLabel: string
}

function ClerkFormSkeleton({ showConsent }: { showConsent: boolean }) {
  const pulse = "animate-pulse rounded-md bg-slate-800/75 motion-reduce:animate-none"

  return (
    <div aria-label="Loading sign-in options" aria-busy="true">
      {showConsent ? (
        <div className="flex min-h-16 items-start gap-2.5 rounded-lg border border-slate-800/80 p-3 md:gap-3 md:p-3.5">
          <div className={`${pulse} h-[18px] w-[18px] shrink-0`} />
          <div className="flex-1">
            <div className={`${pulse} h-3.5 w-full`} />
            <div className={`${pulse} mt-2 h-3.5 w-3/4`} />
          </div>
        </div>
      ) : null}
      <div className={showConsent ? "mt-4 md:mt-5" : ""}>
        <div className="grid grid-cols-2 gap-2">
          <div className={`${pulse} h-12 rounded-lg`} />
          <div className={`${pulse} h-12 rounded-lg`} />
        </div>
        <div className="my-4 flex items-center gap-3">
          <div className={`${pulse} h-px flex-1`} />
          <div className={`${pulse} h-3 w-4`} />
          <div className={`${pulse} h-px flex-1`} />
        </div>
        {[0, 1].map((item) => (
          <div key={item} className={item === 0 ? "" : "mt-4"}>
            <div className={`${pulse} h-3.5 w-24`} />
            <div className={`${pulse} mt-2 h-12 w-full rounded-lg`} />
          </div>
        ))}
        <div className={`${pulse} mt-5 h-12 w-full rounded-lg`} />
        <div className="mt-6 border-t border-slate-800/70 pt-4">
          <div className={`${pulse} mx-auto h-3.5 w-48`} />
        </div>
      </div>
    </div>
  )
}

export default function AuthClerkPanel({
  mode,
  redirectUrl,
  alternateAuthUrl,
  alternateLabel,
}: AuthClerkPanelProps) {
  const { isLoaded } = useAuth()
  const [legalAccepted, setLegalAccepted] = useState(true)
  const isSignUp = mode === "sign-up"

  if (!isLoaded) return <ClerkFormSkeleton showConsent={isSignUp} />

  return (
    <div className="auth-clerk-form flex w-full flex-col">
      {isSignUp ? (
        <AuthLegalConsent accepted={legalAccepted} onAcceptedChange={setLegalAccepted} />
      ) : null}

      <div
        className={`${isSignUp ? "mt-4 md:mt-5" : ""} transition-opacity duration-200 motion-reduce:transition-none ${
          isSignUp && !legalAccepted ? "pointer-events-none opacity-40" : ""
        }`}
        aria-hidden={isSignUp && !legalAccepted}
        inert={isSignUp && !legalAccepted}
      >
        {mode === "sign-in" ? (
          <SignIn
            appearance={authClerkAppearance}
            forceRedirectUrl={redirectUrl}
            fallbackRedirectUrl={redirectUrl}
            signUpUrl={alternateAuthUrl}
          />
        ) : (
          <SignUp
            appearance={authClerkAppearance}
            forceRedirectUrl={redirectUrl}
            fallbackRedirectUrl={redirectUrl}
            signInUrl={alternateAuthUrl}
          />
        )}
      </div>

      {isSignUp && !legalAccepted ? (
        <p
          role="status"
          className="mt-3 rounded-lg border border-amber-400/20 bg-amber-950/20 px-3 py-2.5 text-center text-xs leading-5 text-amber-100"
        >
          Accept the Terms and Privacy Policy to continue.
        </p>
      ) : null}

      <p className="mt-5 border-t border-slate-800/70 pt-3.5 text-center text-sm text-slate-400 md:pt-4">
        <Link
          href={alternateAuthUrl}
          className="inline-flex min-h-11 items-center font-semibold text-sky-300 underline-offset-2 transition-colors hover:text-sky-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          {alternateLabel}
        </Link>
      </p>
    </div>
  )
}
