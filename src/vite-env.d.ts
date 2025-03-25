
/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    storage: {
      setItem: (key: string, value: string) => Promise<boolean>;
      getItem: (key: string) => Promise<string | null>;
      removeItem: (key: string) => Promise<boolean>;
    }
  }
}
