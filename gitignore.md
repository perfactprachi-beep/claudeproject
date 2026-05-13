# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SHOPPERS STOP MVP — .gitignore
# React 18 + TypeScript + Tailwind + Vite / CRA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ── Dependencies ────────────────────────────────────
node_modules/
.pnp
.pnp.js
.yarn/install-state.gz

# ── Build Output ─────────────────────────────────────
dist/
dist-ssr/
build/
out/
.next/
.nuxt/
.output/

# ── Environment Variables ────────────────────────────
# NEVER commit secrets or API keys
.env
.env.local
.env.development
.env.development.local
.env.test
.env.test.local
.env.production
.env.production.local
.env.staging

# Template (safe to commit — no real values)
# .env.example  ← intentionally NOT ignored

# ── Firebase ─────────────────────────────────────────
.firebase/
firebase-debug.log
firestore-debug.log
ui-debug.log
firebase-export-*/
.firebaserc         # commit this if it has no secrets

# ── Razorpay ─────────────────────────────────────────
# Keys go in .env — never hardcoded
razorpay-webhook-secret.txt

# ── Algolia ──────────────────────────────────────────
algolia-admin-key.txt

# ── Contentful ───────────────────────────────────────
contentful-management-token.txt

# ── Testing ──────────────────────────────────────────
coverage/
.nyc_output/
test-results/
playwright-report/
playwright/.cache/
cypress/videos/
cypress/screenshots/
cypress/downloads/

# ── Vite ─────────────────────────────────────────────
vite.config.ts.timestamp-*

# ── TypeScript ───────────────────────────────────────
*.tsbuildinfo
tsconfig.tsbuildinfo

# ── ESLint & Prettier ────────────────────────────────
.eslintcache
.prettiercache

# ── Logs ─────────────────────────────────────────────
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# ── OS Files ─────────────────────────────────────────
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# ── IDE / Editor ─────────────────────────────────────
.vscode/
!.vscode/extensions.json     # safe to share recommended extensions
!.vscode/settings.json       # safe to share project settings
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
*.swp
*.swo
.history/

# ── Storybook ────────────────────────────────────────
storybook-static/
.storybook/node_modules

# ── Vercel ───────────────────────────────────────────
.vercel/

# ── Netlify ──────────────────────────────────────────
.netlify/

# ── Sentry ───────────────────────────────────────────
.sentryclirc

# ── Misc ─────────────────────────────────────────────
*.local
.cache/
.parcel-cache/
.turbo/
.nx/cache
*.pem
*.key
*.cert
*.p12
*.pfx

# ── Analytics / Tracking (local exports) ─────────────
ga-export-*.json
analytics-*.csv

# ── Design Assets (large binaries — use Figma/LFS) ───
# *.fig                     # Figma files — use Figma cloud
# *.sketch                  # Sketch files
# *.psd                     # Photoshop files
# *.ai                      # Illustrator files
# Uncomment above if you want to block binary design files

# ── Temporary Files ──────────────────────────────────
tmp/
temp/
.tmp/
*.tmp
*.bak
*.orig

# ── Package Manager Locks (pick ONE and commit it) ───
# If using npm:  commit package-lock.json, ignore others
# If using yarn: commit yarn.lock, ignore others
# If using pnpm: commit pnpm-lock.yaml, ignore others
# Uncomment the ones you DON'T use:
# package-lock.json
# yarn.lock
# pnpm-lock.yaml
