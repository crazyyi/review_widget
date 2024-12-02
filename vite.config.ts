import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "production"
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    lib: {
      entry: "./src/index.tsx",
      name: "feedback-widget",
      fileName: (format) => `widget.${format}.js`
    },
    target: "esnext"
  }
})
