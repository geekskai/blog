import { ClerkProvider } from "@clerk/nextjs"
import type { ReactNode } from "react"

export default function ClerkAppProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in/"
      signUpUrl="/sign-up/"
      appearance={{
        variables: {
          colorPrimary: "#ec4899",
          colorPrimaryForeground: "#ffffff",
          colorNeutral: "#f8fafc",
          colorBackground: "#0b1224",
          colorForeground: "#f8fafc",
          colorMuted: "#111c33",
          colorMutedForeground: "#a7b2c8",
          colorInput: "#060c1a",
          colorInputForeground: "#f8fafc",
          colorBorder: "rgba(148, 163, 184, 0.22)",
          colorRing: "rgba(236, 72, 153, 0.48)",
          colorShadow: "#020617",
          borderRadius: "0.75rem",
        },
        elements: {
          cardBox: {
            boxShadow: "none",
          },
          card: {
            backgroundColor: "#0b1224",
            border: "1px solid rgba(148, 163, 184, 0.2)",
            boxShadow: "0 26px 70px -28px rgba(2, 6, 23, 0.95)",
          },
          headerTitle: {
            color: "#f8fafc",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          },
          headerSubtitle: {
            color: "#a7b2c8",
          },
          socialButtonsBlockButton: {
            minHeight: "2.75rem",
            color: "#f8fafc",
            backgroundColor: "#111c33",
            border: "1px solid rgba(148, 163, 184, 0.24)",
            boxShadow: "none",
            "&:hover": {
              color: "#ffffff",
              backgroundColor: "#17223b",
              borderColor: "rgba(236, 72, 153, 0.5)",
              transform: "translateY(-1px)",
            },
            "&:focus-visible": {
              outline: "2px solid rgba(236, 72, 153, 0.75)",
              outlineOffset: "2px",
            },
          },
          socialButtonsBlockButtonText: {
            color: "#f8fafc",
            fontWeight: 600,
          },
          dividerLine: {
            backgroundColor: "rgba(148, 163, 184, 0.2)",
          },
          dividerText: {
            color: "#94a3b8",
          },
          formFieldLabel: {
            color: "#e2e8f0",
            fontWeight: 600,
          },
          formFieldInput: {
            minHeight: "2.75rem",
            color: "#f8fafc !important",
            caretColor: "#f472b6",
            backgroundColor: "#060c1a !important",
            border: "1px solid rgba(148, 163, 184, 0.34) !important",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.025)",
            "&::placeholder": {
              color: "#64748b",
              opacity: 1,
            },
            "&:hover": {
              borderColor: "rgba(244, 114, 182, 0.58) !important",
            },
            "&:focus, &:focus-visible": {
              borderColor: "#f472b6 !important",
              boxShadow: "0 0 0 3px rgba(236, 72, 153, 0.18) !important",
            },
          },
          formFieldInputShowPasswordButton: {
            color: "#94a3b8",
            "&:hover": {
              color: "#f8fafc",
            },
          },
          formButtonPrimary: {
            minHeight: "2.75rem",
            color: "#ffffff",
            fontWeight: 700,
            backgroundColor: "transparent",
            backgroundImage: "linear-gradient(90deg, #ec4899 0%, #d946ef 48%, #7c3aed 100%)",
            border: "1px solid rgba(244, 114, 182, 0.38)",
            boxShadow: "0 12px 28px -16px rgba(236, 72, 153, 0.95)",
            "&:hover": {
              color: "#ffffff",
              backgroundImage: "linear-gradient(90deg, #f472b6 0%, #e879f9 48%, #8b5cf6 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 15px 30px -16px rgba(236, 72, 153, 1)",
            },
            "&:focus-visible": {
              outline: "2px solid rgba(244, 114, 182, 0.9)",
              outlineOffset: "2px",
            },
          },
          footer: {
            backgroundColor: "transparent",
            backgroundImage: "none",
          },
          footerActionText: {
            color: "#94a3b8",
          },
          footerActionLink: {
            color: "#f472b6",
            fontWeight: 700,
            "&:hover": {
              color: "#f9a8d4",
            },
          },
          formFieldErrorText: {
            color: "#fda4af",
          },
          alertText: {
            color: "#fda4af",
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
