import fs from "fs";
import path from "path";

const DOMAIN = "https://sabriaz.com";

// yahan apne sare routes list karo
const routes = [
  "/",
  "/login",
  "/register",
  "/shop",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
  "/my-orders",

  // Dynamic routes patterns
  "/product/:id",
  "/category/:slug",

];

// dynamic routes ko generic entry banane ka tareeqa:
function cleanRoute(route) {
  return route.replace(/:\w+/g, "");
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

routes.forEach((route) => {
  const clean = cleanRoute(route);
  xml += `
  <url>
    <loc>${DOMAIN}${clean}</loc>
    <changefreq>weekly</changefreq>
  </url>`;
});

xml += `
</urlset>
`;

// write sitemap to public folder
const publicPath = path.join(process.cwd(), "public", "sitemap.xml");

fs.writeFileSync(publicPath, xml.trim());

console.log("✔ Sitemap generated successfully at public/sitemap.xml");
