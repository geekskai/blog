import { boxShadow } from "html2canvas-pro/dist/types/css/property-descriptors/box-shadow"

const controlRadius = "8px"

export const authClerkAppearance = {
  variables: {
    colorPrimary: "#0ea5e9",
    colorPrimaryForeground: "#ffffff",
    colorNeutral: "#f8fafc",
    colorBackground: "transparent",
    colorForeground: "#f8fafc",
    colorMuted: "#111827",
    colorMutedForeground: "#94a3b8",
    colorInput: "#1e293b",
    colorInputForeground: "#f8fafc",
    colorBorder: "rgba(148, 163, 184, 0.55)",
    colorRing: "rgba(14, 165, 233, 0.45)",
    colorShadow: "transparent",
    borderRadius: controlRadius,
  },
  elements: {
    rootBox: {
      width: "100%",
      maxWidth: "100%",
    },
    cardBox: {
      width: "100%",
      boxShadow: "none",
    },
    card: {
      width: "100%",
      backgroundColor: "transparent",
      border: "none",
      boxShadow: "none",
      padding: "0",
    },
    header: {
      display: "none",
    },
    headerTitle: {
      display: "none",
    },
    headerSubtitle: {
      display: "none",
    },
    button: {
      borderRadius: `${controlRadius} !important`,
    },
    socialButtonsBlockButton: {
      minHeight: "3rem",
      borderRadius: `${controlRadius} !important`,
      overflow: "hidden",
      color: "#f8fafc",
      backgroundColor: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(148, 163, 184, 0.24)",
      boxShadow: "none",
      transition: "border-color 160ms ease, background-color 160ms ease, transform 160ms ease",
      "&:hover": {
        color: "#ffffff",
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        borderColor: "rgba(14, 165, 233, 0.45)",
        transform: "translateY(-1px)",
      },
      "&:focus-visible": {
        outline: "2px solid rgba(56, 189, 248, 0.8)",
        outlineOffset: "2px",
      },
    },
    socialButtons: {
      gap: "0.625rem",
    },
    socialButtonsProviderIcon: {
      width: "1rem",
      height: "1rem",
    },
    socialButtonsBlockButtonText: {
      color: "#f8fafc",
      fontWeight: 600,
    },
    dividerLine: {
      backgroundColor: "rgba(148, 163, 184, 0.18)",
    },
    dividerText: {
      color: "#64748b",
      fontSize: "0.75rem",
    },
    dividerRow: {
      margin: "0.125rem 0",
    },
    formFieldLabel: {
      color: "#e2e8f0",
      fontWeight: 600,
      fontSize: "0.8125rem",
      marginBottom: "0.375rem",
    },
    formField: {
      gap: "0.375rem",
    },
    form: {
      gap: "1rem",
    },
    formFieldInputGroup: {
      borderRadius: `${controlRadius} !important`,
    },
    otpCodeField: {
      width: "90% !important",
      maxWidth: "90%",
    },
    otpCodeFieldInputContainer: {
      width: "90% !important",
    },
    otpCodeFieldInputs: {
      display: "flex",
      width: "100%",
      overflow: "visible",
      gap: "0.5rem",
    },
    otpCodeFieldInput: {
      flex: "1 1 0",
      minWidth: "0",
      height: "3rem",
      minHeight: "3rem",
      width: "auto",
      borderRadius: `${controlRadius} !important`,
      backgroundColor: "#1e293b !important",
      border: "1.5px solid rgba(148, 163, 184, 0.72) !important",
      color: "#f8fafc !important",
      fontSize: "1.125rem",
      fontWeight: 700,
      textAlign: "center",
      caretColor: "#38bdf8",
      opacity: "1 !important",
      "&:hover": {
        borderColor: "rgba(56, 189, 248, 0.7) !important",
        backgroundColor: "#334155 !important",
      },
      "&:focus, &:focus-visible, &[data-focus-within='true']": {
        borderColor: "#38bdf8 !important",
        backgroundColor: "#1e293b !important",
        boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.22) !important",
      },
    },
    formFieldInput: {
      minHeight: "3rem",
      borderRadius: `${controlRadius} !important`,
      color: "#f8fafc !important",
      caretColor: "#38bdf8",
      backgroundColor: "rgba(2, 6, 23, 0.76) !important",
      border: "1px solid rgba(148, 163, 184, 0.32) !important",
      "&::placeholder": {
        color: "#64748b",
        opacity: 1,
      },
      "&:hover": {
        borderColor: "rgba(56, 189, 248, 0.5) !important",
      },
      "&:focus, &:focus-visible": {
        borderColor: "#38bdf8 !important",
        boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.18) !important",
      },
    },
    formFieldInputShowPasswordButton: {
      color: "#94a3b8",
      "&:hover": {
        color: "#f8fafc",
      },
    },
    formButtonPrimary: {
      minHeight: "3rem",
      borderRadius: `${controlRadius} !important`,
      overflow: "hidden",
      color: "#ffffff",
      fontWeight: 700,
      boxShadow: "none !important",
      backgroundColor: "#0284c7",
      backgroundImage: "linear-gradient(90deg, #0ea5e9 0%, #0284c7 52%, #7c3aed 100%)",
      border: "1px solid rgba(56, 189, 248, 0.35)",
      "&:hover": {
        backgroundImage: "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 52%, #8b5cf6 100%)",
        transform: "translateY(-1px)",
        boxShadow: "0 14px 32px -14px rgba(14, 165, 233, 0.8)",
      },
      "&:focus-visible": {
        outline: "2px solid rgba(125, 211, 252, 0.9)",
        outlineOffset: "2px",
      },
    },
    main: {
      gap: "1rem",
    },
    footer: {
      display: "none",
      backgroundColor: "transparent",
      backgroundImage: "none",
    },
    footerAction: {
      display: "none",
    },
    footerActionText: {
      display: "none",
    },
    footerActionLink: {
      display: "none",
    },
    formFieldErrorText: {
      color: "#fda4af",
    },
    alertText: {
      color: "#fda4af",
    },
    identityPreview: {
      borderRadius: `${controlRadius} !important`,
      backgroundColor: "rgba(15, 23, 42, 0.85)",
      border: "1px solid rgba(148, 163, 184, 0.2)",
    },
    formFieldCheckboxInput: {
      accentColor: "#0ea5e9",
    },
    formFieldCheckboxLabel: {
      color: "#cbd5e1",
    },
  },
}
