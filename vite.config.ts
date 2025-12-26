import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['@mediapipe/hands', '@mediapipe/camera_utils', '@mediapipe/drawing_utils'],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          'mediapipe-hands': ['@mediapipe/hands'],
          'mediapipe-camera': ['@mediapipe/camera_utils'],
        }
      }
    }
  }
}));
