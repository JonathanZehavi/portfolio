// Renders public/og.png (1200x630) and public/apple-touch-icon.png (180x180).
// Run: node scripts/make-images.cjs   (needs Playwright with Chromium)
const path = require('node:path')
const { chromium } = require('playwright')

;(async () => {
  const root = path.resolve(__dirname, '..')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  await page.goto('file://' + path.join(root, 'scripts/og.html'))
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: path.join(root, 'public/og.png') })

  const icon = await browser.newPage({ viewport: { width: 180, height: 180 } })
  // Full-bleed square: iOS rounds the corners itself.
  await icon.setContent(
    `<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="180" height="180" style="display:block"><rect width="64" height="64" fill="#1d1d1f"/><path d="M38 16v22a9 9 0 0 1-17 4" stroke="#f5f5f7" stroke-width="6" stroke-linecap="round" fill="none"/></svg></body>`,
  )
  await icon.screenshot({ path: path.join(root, 'public/apple-touch-icon.png') })
  await browser.close()
})()
