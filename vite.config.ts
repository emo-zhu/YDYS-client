import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  build: {
    outDir: "YDYF-client",
  },
  base: "/medical",
  resolve: {
    alias: [
      {
        find: "@",
        replacement: `/src`,
      },
    ],
  },
  server: {
    host: "0.0.0.0",
    port: 4007,
    open: true,
    cors: {
      credentials: true,
      methods: "PUT,POST,GET,DELETE,OPTIONS",
      origin: "http://localhost:5173", // 主应用地址
    }, // 允许跨域
    proxy: {
      // 73:9194
      "/hrssc-unitassessment": {
        target: "http://192.168.1.84:9100/hrssc-unitassessment",
        // target: 'http://192.168.1.15:9290',
        // target: 'http://localhost:9194',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hrssc-unitassessment/, ""),
      },
      "/hrssc-organization": {
        // target: 'http://192.168.1.84:9200//hrssc-organization',
        target: "http://192.168.1.84:9100/hrssc-organization",
        // target: 'http://192.168.1.87:9194/hrssc-organization',
        // target: 'http://localhost:9094',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/hrssc-organization/, ""),
      },
      "/hrssc-system": {
        target: "http://192.168.1.84:9100/hrssc-system",
        // target: 'http://192.168.1.84:9200//hrssc-system',
        // target: 'http://localhost:9095',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/hrssc-system/, ""),
      },
      "/hrssc-storage": {
        target: "http://192.168.1.84:9100/hrssc-storage",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/hrssc-storage/, ""),
      },
      "/hrssc-paas": {
        target: "http://192.168.1.84:9100/hrssc-paas",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hrssc-paas/, ""),
      },
      "/hrssc-message": {
        target: "http://192.168.1.84:9100/hrssc-message",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hrssc-message/, ""),
      },
    },
  },
});
