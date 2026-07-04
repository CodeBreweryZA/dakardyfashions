# DakardyFashions - Setup Script
# Run this script from the project root directory

Write-Host "=== DakardyFashions Setup ===" -ForegroundColor Gold

# Step 1: Install dependencies
Write-Host "`n[1/4] Installing npm dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "npm install failed" -ForegroundColor Red; exit 1 }

# Step 2: Generate Prisma client
Write-Host "`n[2/4] Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Host "Prisma generate failed" -ForegroundColor Red; exit 1 }

# Step 3: Push schema to database
Write-Host "`n[3/4] Pushing schema to database..." -ForegroundColor Cyan
npx prisma db push
if ($LASTEXITCODE -ne 0) { Write-Host "Prisma db push failed" -ForegroundColor Red; exit 1 }

# Step 4: Seed database
Write-Host "`n[4/4] Seeding database..." -ForegroundColor Cyan
npx prisma db seed
if ($LASTEXITCODE -ne 0) { Write-Host "Seeding failed" -ForegroundColor Red; exit 1 }

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "Run 'npm run dev' to start the development server." -ForegroundColor Green
