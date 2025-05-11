import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    vue(),
    viteCompression({
      algorithm: "gzip", // 或 'brotliCompress'
      ext: ".gz",
      threshold: 10240, // 对大于10KB的文件进行压缩
      deleteOriginFile: false,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    // 代码分割优
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ["echarts"],
          vue: ["vue", "vue-router"],
        },
      },
    },
  },
});
