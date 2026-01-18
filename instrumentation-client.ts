import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Adds request headers and IP for users
  allowUrls: [/https?:\/\/((www)\.)?geekskai\.com/],
  sendDefaultPii: true,
  // Capture 100% in dev, 10% in production
  // Adjust based on your traffic volume
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  integrations: [
    Sentry.replayIntegration({
      // 关闭默认的“所有文本都打星号”
      maskAllText: false,
      // 如果希望图片/视频也正常显示，可以一起关掉
      blockAllMedia: false,
    }),
  ],
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Enable logs to be sent to Sentry
  enableLogs: true,
})
// This export will instrument router navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
