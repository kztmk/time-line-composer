/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_API_KEY: string
  readonly RENDERER_VITE_AUTH_DOMAIN: string
  readonly RENDERER_VITE_DATABASE_URL: string
  readonly RENDERER_VITE_PROJECT_ID: string
  readonly RENDERER_VITE_STORAGE_BUCKET: string
  readonly RENDERER_VITE_MESSAGING_SENDER_ID: string
  readonly RENDERER_VITE_APP_ID: string
  readonly RENDERER_VITE_MEASUREMENT_ID: string
  readonly RENDERER_VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
