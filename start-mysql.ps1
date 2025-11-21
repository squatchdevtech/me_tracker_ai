# PowerShell script to start MySQL 80 service

$serviceName = "MySQL80"

Write-Host "Checking MySQL service status..." -ForegroundColor Cyan

# Check if the service exists
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if ($null -eq $service) {
    Write-Host "Error: Service '$serviceName' not found." -ForegroundColor Red
    Write-Host "Available MySQL services:" -ForegroundColor Yellow
    Get-Service | Where-Object { $_.Name -like "*MySQL*" } | Format-Table Name, DisplayName, Status
    exit 1
}

Write-Host "Service found: $($service.DisplayName)" -ForegroundColor Green

# Check current status
if ($service.Status -eq "Running") {
    Write-Host "MySQL service is already running." -ForegroundColor Green
    exit 0
}

# Start the service
Write-Host "Starting MySQL service..." -ForegroundColor Cyan
try {
    Start-Service -Name $serviceName
    Start-Sleep -Seconds 2
    
    # Verify the service started
    $service = Get-Service -Name $serviceName
    if ($service.Status -eq "Running") {
        Write-Host "MySQL service started successfully!" -ForegroundColor Green
    } else {
        Write-Host "Warning: Service may not have started properly. Status: $($service.Status)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error starting MySQL service: $_" -ForegroundColor Red
    exit 1
}


