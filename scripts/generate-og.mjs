// Regenerates public/og-image.png from an inline SVG.
// Run with: node scripts/generate-og.mjs  (requires @resvg/resvg-js)
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync } from "node:fs";

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f221c"/>
      <stop offset="100%" stop-color="#16332a"/>
    </linearGradient>
    <linearGradient id="emerald" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3a9e78"/>
      <stop offset="100%" stop-color="#56c79a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.18" cy="0.2" r="0.7">
      <stop offset="0%" stop-color="#2c7d5d" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#2c7d5d" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- eyebrow -->
  <circle cx="90" cy="118" r="7" fill="#56c79a"/>
  <text x="112" y="126" font-family="Arial, sans-serif" font-size="24" font-weight="700"
        letter-spacing="6" fill="#56c79a">HET ONAFHANKELIJKE BURGERPLATFORM</text>

  <!-- wordmark -->
  <text x="86" y="320" font-family="Arial Black, Arial, sans-serif" font-size="150"
        font-weight="900" letter-spacing="-2" fill="#faf8f3">SURINAME</text>
  <text x="86" y="455" font-family="Arial Black, Arial, sans-serif" font-size="150"
        font-weight="900" letter-spacing="-2" fill="url(#emerald)">SPREEKT.</text>

  <!-- subtitle -->
  <text x="90" y="540" font-family="Arial, sans-serif" font-size="32" fill="#c9d6cf">
    Stem op actuele stellingen over politiek, economie en samenleving.</text>

  <!-- bottom accent bar -->
  <rect x="0" y="610" width="1200" height="20" fill="url(#emerald)"/>
</svg>`;

const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
const png = resvg.render().asPng();
writeFileSync(new URL("../public/og-image.png", import.meta.url), png);
console.log("Wrote public/og-image.png", png.length, "bytes");
