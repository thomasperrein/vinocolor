require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Récupère l'URL de base depuis .env
const BASE_URL = process.env.VITE_REACT_APP_BASE_URL;

if (!BASE_URL) {
  console.error("L'URL de base n'est pas définie dans le fichier .env.");
  process.exit(1);
}

// Liste des chemins
const routes = [
  { path: "/", priority: 1.0 },
  { path: "/about", priority: 0.8 },
  { path: "/products", priority: 0.9 },
  { path: "/privacy-policy", priority: 0.6 },
  { path: "/products/:id", priority: 0.7 },
  { path: "/my-cart", priority: 0.7 },
  { path: "/checkout", priority: 0.8 },
  { path: "/payment", priority: 0.6 },
  { path: "/contact", priority: 0.5 },
  { path: "/success-order", priority: 0.7 },
];

// Générer le contenu XML de la sitemap
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (route) => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <priority>${route.priority}</priority>
  </url>
  `
    )
    .join('')}
</urlset>`;

// Chemin de sortie
const outputPath = path.resolve(__dirname, 'public', 'sitemap.xml');

// Écrire le fichier sitemap.xml
fs.writeFileSync(outputPath, sitemapContent, 'utf8');

console.log(`Sitemap générée avec succès : ${outputPath}`);
