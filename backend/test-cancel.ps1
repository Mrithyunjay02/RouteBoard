$ErrorActionPreference = "Stop"

$loginPayload = @{ email = "admin@test.com"; password = "password123" } | ConvertTo-Json -Compress
Set-Content -Path "login.json" -Value $loginPayload
$loginResponse = curl.exe -s -X POST -H "Content-Type: application/json" -d "@login.json" http://localhost:3000/auth/login
$token = ($loginResponse | ConvertFrom-Json).access_token

Write-Host "--- Canceling trip 15 ---"
$patchPayload = @{ status = "CANCELLED" } | ConvertTo-Json -Compress
Set-Content -Path "patch.json" -Value $patchPayload
$patchResponse = curl.exe -s -X PATCH -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "@patch.json" http://localhost:3000/trips/15
Write-Host "Patch response:"
Write-Host $patchResponse

Write-Host "--- Getting trip history ---"
$historyResponse = curl.exe -s -X GET -H "Authorization: Bearer $token" http://localhost:3000/history/15
Write-Host "History response:"
Write-Host $historyResponse
