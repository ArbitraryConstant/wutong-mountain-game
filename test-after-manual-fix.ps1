$railwayUrl = "https://wutong-mountain-game-production.up.railway.app"
$testPlayer = @{ passphrase = "test-manual-db-fix-$(Get-Random)" } | ConvertTo-Json
try {
    $response = Invoke-RestMethod -Uri "$railwayUrl/api/player/new" -Method POST -Body $testPlayer -ContentType "application/json" -TimeoutSec 15
    Write-Host "🎉 SUCCESS! PLAYER CREATION WORKS!" -ForegroundColor Green
    Write-Host "🧠 Insight: $($response.player.insight)" -ForegroundColor Yellow
    Write-Host "🧠 Presence: $($response.player.presence)" -ForegroundColor Yellow
    Write-Host "🧠 Resolve: $($response.player.resolve)" -ForegroundColor Yellow  
    Write-Host "🧠 Vigor: $($response.player.vigor)" -ForegroundColor Yellow
    Write-Host "🧠 Harmony: $($response.player.harmony)" -ForegroundColor Yellow
    Write-Host "🏔️ WuTong Mountain consciousness evolution system is OPERATIONAL!" -ForegroundColor Green
} catch {
    Write-Host "❌ Still not working: $($_.Exception.Message)" -ForegroundColor Red
}
