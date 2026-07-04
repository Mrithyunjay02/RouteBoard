$ErrorActionPreference = "Stop"

$loginPayload = @{ email = "admin@test.com"; password = "password123" } | ConvertTo-Json -Compress
Set-Content -Path "login.json" -Value $loginPayload
$loginResponse = curl.exe -s -X POST -H "Content-Type: application/json" -d "@login.json" http://localhost:3000/auth/login
$token = ($loginResponse | ConvertFrom-Json).access_token

Write-Host "--- Testing driverId as String ---"
curl.exe -s -X POST -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "@payload-string.json" http://localhost:3000/trips

Write-Host "`n--- Testing driverId as Integer ---"
curl.exe -s -X POST -H "Authorization: Bearer $token" -H "Content-Type: application/json" -d "@payload-int.json" http://localhost:3000/trips
