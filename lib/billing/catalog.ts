export const CREDIT_CATALOG = {
  freeDaily: {
    key: "audio_credits_free_daily",
    credits: 30,
    price: 0,
    validityDays: 1,
    batchFileLimit: 1,
    zipExport: false,
  },
  payg480: {
    key: "audio_credits_payg_480",
    credits: 480,
    price: 14,
    currency: "USD",
    validityDays: 365,
    batchFileLimit: 50,
    zipExport: true,
  },
  regularMonthly: {
    key: "audio_credits_regular_monthly_2800",
    credits: 2800,
    price: 29,
    currency: "USD",
    batchFileLimit: 50,
    zipExport: true,
  },
} as const
