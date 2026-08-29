export const authClerkAppearance = {
  theme: "simple" as const,
  variables: {
    colorPrimary: "#0ea5e9",
    colorPrimaryForeground: "#ffffff",
    colorNeutral: "#f8fafc",
    colorBackground: "transparent",
    colorForeground: "#f8fafc",
    colorMuted: "#111827",
    colorMutedForeground: "#94a3b8",
    colorInput: "#020617",
    colorInputForeground: "#f8fafc",
    colorBorder: "rgba(148, 163, 184, 0.24)",
    colorRing: "rgba(14, 165, 233, 0.45)",
    colorShadow: "transparent",
    borderRadius: "0.75rem",
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
    socialButtonsBlockButton: {
      minHeight: "3rem",
      borderTopLeftRadius: "0.75rem",
      borderTopRightRadius: "0.75rem",
      borderBottomRightRadius: "0.75rem",
      borderBottomLeftRadius: "0.75rem",
      overflow: "hidden",
      backgroundClip: "padding-box",
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
    formFieldInput: {
      minHeight: "3rem",
      borderRadius: "0.75rem",
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
      marginTop: "0.25rem",
      borderTopLeftRadius: "0.75rem",
      borderTopRightRadius: "0.75rem",
      borderBottomRightRadius: "0.75rem",
      borderBottomLeftRadius: "0.75rem",
      overflow: "hidden",
      backgroundClip: "padding-box",
      color: "#ffffff",
      fontWeight: 700,
      backgroundColor: "#0284c7",
      backgroundImage: "linear-gradient(90deg, #0ea5e9 0%, #0284c7 52%, #7c3aed 100%)",
      border: "1px solid rgba(56, 189, 248, 0.35)",
      boxShadow: "0 10px 28px -14px rgba(14, 165, 233, 0.65)",
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
