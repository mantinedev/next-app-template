import next from "next/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [next()],
  ssr: {
    noExternal: ["@mantine/core"]
  }
});
