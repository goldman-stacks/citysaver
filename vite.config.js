import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/citysaver/", // MUST match your repo name
  build: {
    outDir: "docs",    // <-- put build output in /docs instead of /dist
  },
});
