export const PACKAGE_CATALOG = {
  free: {
    monthlyPrice: 0,
    annualPrice: 0,
    audioBatchFileLimit: 1,
    zipExport: false,
    downloadDailyLimit: 10,
    downloadConcurrency: 1,
    shareUnlockAvailable: true,
    support: "Documentation and community support",
  },
  basic: {
    monthlyPrice: 10,
    annualPrice: 96,
    audioBatchFileLimit: 20,
    zipExport: true,
    downloadDailyLimit: 50,
    downloadConcurrency: 2,
    shareUnlockAvailable: false,
    support: "Email response within 2 business days",
  },
  pro: {
    monthlyPrice: 25,
    annualPrice: 240,
    audioBatchFileLimit: 50,
    zipExport: true,
    downloadDailyLimit: 200,
    downloadConcurrency: 4,
    shareUnlockAvailable: false,
    support: "Priority response within 1 business day",
  },
  enterprise: {
    monthlyPrice: null,
    annualPrice: null,
    audioBatchFileLimit: 50,
    zipExport: true,
    downloadDailyLimit: 200,
    downloadConcurrency: 4,
    shareUnlockAvailable: false,
    support: "Contract-defined onboarding and support",
  },
} as const

export const ANNUAL_SAVINGS = {
  basic: PACKAGE_CATALOG.basic.monthlyPrice * 12 - PACKAGE_CATALOG.basic.annualPrice,
  pro: PACKAGE_CATALOG.pro.monthlyPrice * 12 - PACKAGE_CATALOG.pro.annualPrice,
} as const
