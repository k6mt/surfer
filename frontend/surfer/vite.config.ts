import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  base: "/k6m-surfer",
  plugins: [
    tsconfigPaths(),
    react(),
    visualizer({
      open: true, // 빌드 끝나면 stats.html 자동 오픈
      template: "treemap", // sunburst | treemap | network
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    // remove previous build files
    emptyOutDir: true,
    // static assets directory
    assetsDir: "assets",

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    target: "es2019",

    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        manualChunks: {
          react: ["react", "react-dom"],
          reactRouter: ["react-router-dom"],
          chartJs: ["chart.js"],
        },
      },
    },
  },
});
