$ErrorActionPreference = "Stop"

$loginPayload = @{ email = "admin@test.com"; password = "password123" } | ConvertTo-Json -Compress
Set-Content -Path "login.json" -Value $loginPayload
$loginResponse = curl.exe -s -X POST -H "Content-Type: application/json" -d "@login.json" http://localhost:3000/auth/login
$token = ($loginResponse | ConvertFrom-Json).access_token

Write-Host "--- Attempting to delete trip 2 ---"
$deleteResponse = curl.exe -s -X DELETE -H "Authorization: Bearer $token" -w "\nHTTP Status: %{http_code}" http://localhost:3000/trips/2
Write-Host "Delete response:"
Write-Host $deleteResponse
