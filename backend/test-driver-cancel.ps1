$ErrorActionPreference = "Stop"

$loginPayload = @{ email = "driver@test.com"; password = "password123" } | ConvertTo-Json -Compress
Set-Content -Path "login.json" -Value $loginPayload
$loginResponse = curl.exe -s -X POST -H "Content-Type: application/json" -d "@login.json" http://localhost:3000/auth/login
$token = ($loginResponse | ConvertFrom-Json).access_token

Write-Host "--- Driver Attempting to Cancel Trip ---"
$patchPayload = @{ status = "CANCELLED" } | ConvertTo-Json -Compress
Set-Content -Path "patch.json" -Value $patchPayload
$patchResponse = curl.exe -s -X PATCH -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "@patch.json" -w "\nHTTP Status: %{http_code}" http://localhost:3000/trips/4
Write-Host "Patch response:"
Write-Host $patchResponse
