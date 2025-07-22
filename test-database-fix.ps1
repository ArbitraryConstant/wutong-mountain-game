$railwayUrl = "https://wutong-mountain-game-production.up.railway.app"
Write-Host "Testing consciousness evolution system..." -ForegroundColor Cyan

try {
    $testPlayer = @{
        passphrase = "test-windows-fix-$(Get-Random)"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$railwayUrl/api/player/new" -Method POST -Body $testPlayer -ContentType "application/json" -TimeoutSec 15
    
    Write-Host "🎉 SUCCESS! Player creation works!" -ForegroundColor Green
    Write-Host "Player ID: $($response.player.id)" -ForegroundColor White
    Write-Host "🧠 Insight: $($response.player.insight)" -ForegroundColor Yellow
    Write-Host "🧠 Presence: $($response.player.presence)" -ForegroundColor Yellow
    Write-Host "🧠 Resolve: $($response.player.resolve)" -ForegroundColor Yellow
    Write-Host "🧠 Vigor: $($response.player.vigor)" -ForegroundColor Yellow
    Write-Host "🧠 Harmony: $($response.player.harmony)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🏔️ WuTong Mountain consciousness evolution system is OPERATIONAL!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Still not working: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Database may need more time or additional fixes" -ForegroundColor Yellow
}
