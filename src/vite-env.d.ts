// Fix: Manually defining Vite's `import.meta.env` types to resolve the error
// "Cannot find type definition file for 'vite/client'". This provides the necessary
// types for TypeScript to understand properties like `import.meta.env.DEV`.
interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
