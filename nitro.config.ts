import { defineConfig } from "nitro/config";

export default defineConfig({
  preset: "vercel",
  experimental: {
    tasks: true, // Needed if you want to use the health check for cron jobs later
  },
});
