$ErrorActionPreference = "Stop"

$loginPayload = @{ email = "admin@test.com"; password = "password123" } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body $loginPayload -ContentType "application/json"
$token = $loginResponse.access_token

$tripPayload = '{
    "vehicleNumber": "MH-12-AB-1234",
    "origin": "Mumbai",
    "destination": "Pune",
    "scheduledStart": "2026-07-04T13:51:43.012Z",
    "status": "SCHEDULED",
    "driverId": "2"
}'

$headers = @{ Authorization = "Bearer $token" }

$response = Invoke-WebRequest -Uri "http://localhost:3000/trips" -Method Post -Headers $headers -Body $tripPayload -ContentType "application/json" -SkipHttpErrorCheck

Write-Host "Status Code:" $response.StatusCode
Write-Host "Body:" $response.Content
