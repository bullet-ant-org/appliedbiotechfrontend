import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

const BASE_URL = "https://applied-biotech-demo.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/", "/about", "/contact", "/covid-19", "/gallery", "/news",
          "/academy", "/collections", "/shop", "/shop/categories", "/shop/deals",
        ];
        const services = ["molecular-lab-services", "lab-equipment-and-reagents", "training-and-applied-biotech-institute", "consulting"];
        const entries = [
          ...staticPaths.map((p) => ({ path: p, changefreq: "weekly", priority: p === "/" ? "1.0" : "0.8" })),
          ...services.map((s) => ({ path: `/services/${s}`, changefreq: "monthly", priority: "0.7" })),
          ...CATEGORIES.map((c) => ({ path: `/shop/category/${c.slug}`, changefreq: "weekly", priority: "0.7" })),
          ...PRODUCTS.map((p) => ({ path: `/shop/product/${p.id}`, changefreq: "weekly", priority: "0.6" })),
        ];
        const urls = entries.map((e) =>
          `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});