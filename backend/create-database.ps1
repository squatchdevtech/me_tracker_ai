# PowerShell script to create MySQL database instance
# This script reads the DATABASE_URL from .env and creates the database if it doesn't exist

param(
    [string]$DatabaseName,
    [string]$Host,
    [int]$Port,
    [string]$Username,
    [string]$Password,
    [string]$EnvFile = ".env"
)

# Function to write colored output
function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

# Function to find mysql.exe
function Find-MySQLClient {
    # Check if mysql is in PATH
    $mysqlInPath = Get-Command mysql -ErrorAction SilentlyContinue
    if ($mysqlInPath) {
        return $mysqlInPath.Path
    }
    
    # Check common MySQL installation locations
    $commonPaths = @(
        "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.2\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.3\bin\mysql.exe",
        "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe",
        "C:\xampp\mysql\bin\mysql.exe",
        "C:\wamp64\bin\mysql\mysql*\bin\mysql.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    
    # Check for wildcard paths
    $wildcardPaths = @(
        "C:\Program Files\MySQL\MySQL Server *\bin\mysql.exe",
        "C:\Program Files (x86)\MySQL\MySQL Server *\bin\mysql.exe"
    )
    
    foreach ($pattern in $wildcardPaths) {
        $matches = Get-ChildItem -Path (Split-Path $pattern -Parent) -Filter (Split-Path $pattern -Leaf) -ErrorAction SilentlyContinue
        if ($matches) {
            return $matches[0].FullName
        }
    }
    
    return $null
}

# Function to parse DATABASE_URL
function Parse-DatabaseUrl {
    param([string]$Url)
    
    if ([string]::IsNullOrWhiteSpace($Url)) {
        return $null
    }
    
    # Pattern: mysql://[user[:password]@]host[:port]/database
    # Handle different formats:
    # - mysql://host:port/database
    # - mysql://user@host:port/database  
    # - mysql://user:password@host:port/database
    
    if ($Url -match '^mysql://') {
        $urlWithoutScheme = $Url.Substring(7)  # Remove "mysql://"
        
        # Check if there's an @ symbol (indicating username/password)
        $atIndex = $urlWithoutScheme.IndexOf('@')
        
        $username = ""
        $password = ""
        $hostPart = $urlWithoutScheme
        
        
        if ($atIndex -gt 0) {
            # Has username/password
            $authPart = $urlWithoutScheme.Substring(0, $atIndex)
            $hostPart = $urlWithoutScheme.Substring($atIndex + 1)
            
            # Check if password is present
            $colonIndex = $authPart.IndexOf(':')
            if ($colonIndex -gt 0) {
                $username = [System.Uri]::UnescapeDataString($authPart.Substring(0, $colonIndex))
                $password = [System.Uri]::UnescapeDataString($authPart.Substring($colonIndex + 1))
            } else {
                $username = [System.Uri]::UnescapeDataString($authPart)
            }
        }
        
        # Parse host:port/database
        $slashIndex = $hostPart.IndexOf('/')
        if ($slashIndex -lt 0) {
            return $null
        }
        
        $hostPortPart = $hostPart.Substring(0, $slashIndex)
        $database = $hostPart.Substring($slashIndex + 1)
        
        # Parse host and port
        $colonIndex = $hostPortPart.IndexOf(':')
        $host = ""
        $port = 3306
        
        if ($colonIndex -gt 0) {
            $host = $hostPortPart.Substring(0, $colonIndex)
            $portStr = $hostPortPart.Substring($colonIndex + 1)
            if ([int]::TryParse($portStr, [ref]$port)) {
                # Port parsed successfully
            } else {
                return $null
            }
        } else {
            $host = $hostPortPart
        }
        
        if ([string]::IsNullOrWhiteSpace($host) -or [string]::IsNullOrWhiteSpace($database)) {
            return $null
        }
        
        return @{
            Username = $username
            Password = $password
            Host = $host
            Port = $port
            Database = $database
        }
    }
    
    return $null
}

# Function to read .env file
function Read-EnvFile {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Error "Environment file not found: $FilePath"
        Write-Info "Please create a .env file based on env.example"
        exit 1
    }
    
    $envVars = @{}
    Get-Content $FilePath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            if ($line -match '^([^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                # Remove quotes if present
                if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                elseif ($value.StartsWith("'") -and $value.EndsWith("'")) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                $envVars[$key] = $value
            }
        }
    }
    
    return $envVars
}

# Main execution
Write-Info "=== MySQL Database Creation Script ==="
Write-Host ""

# Read .env file
$envFile = Join-Path $PSScriptRoot $EnvFile
Write-Info "Reading environment file: $envFile"

$envVars = Read-EnvFile -FilePath $envFile

# Get DATABASE_URL
if (-not $envVars.ContainsKey("DATABASE_URL")) {
    Write-Error "DATABASE_URL not found in .env file"
    exit 1
}

$databaseUrl = $envVars["DATABASE_URL"]
Write-Info "Found DATABASE_URL in .env file"

# Parse DATABASE_URL
$dbConfig = Parse-DatabaseUrl -Url $databaseUrl
if (-not $dbConfig) {
    Write-Error "Failed to parse DATABASE_URL. Expected format: mysql://user:password@host:port/database"
    Write-Info "Current DATABASE_URL: $databaseUrl"
    exit 1
}

# Override with parameters if provided
if ($DatabaseName) { $dbConfig.Database = $DatabaseName }
if ($Host) { $dbConfig.Host = $Host }
if ($Port) { $dbConfig.Port = $Port }
if ($Username) { $dbConfig.Username = $Username }
if ($Password) { $dbConfig.Password = $Password }

Write-Info "Database Configuration:"
Write-Host "  Host: $($dbConfig.Host)"
Write-Host "  Port: $($dbConfig.Port)"
Write-Host "  Database: $($dbConfig.Database)"
Write-Host "  Username: $($dbConfig.Username)"
Write-Host ""

# Find MySQL client
Write-Info "Looking for MySQL client..."
$mysqlPath = Find-MySQLClient

if (-not $mysqlPath) {
    Write-Error "MySQL client (mysql.exe) not found."
    Write-Info "Please ensure MySQL is installed and mysql.exe is in your PATH,"
    Write-Info "or install MySQL from https://dev.mysql.com/downloads/mysql/"
    exit 1
}

Write-Success "Found MySQL client: $mysqlPath"

# Prepare connection arguments
$mysqlArgs = @(
    "-h", $dbConfig.Host
    "-P", $dbConfig.Port.ToString()
)

if ($dbConfig.Username) {
    $mysqlArgs += "-u", $dbConfig.Username
}

# If password is provided, use it; otherwise prompt
if ($dbConfig.Password) {
    $mysqlArgs += "-p$($dbConfig.Password)"
}
else {
    Write-Info "No password in connection string. You will be prompted for password."
    $mysqlArgs += "-p"
}

# Test connection first (without specifying database)
Write-Info "Testing MySQL connection..."
$testQuery = "SELECT 1;"
$testResult = & $mysqlPath $mysqlArgs -e $testQuery 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to connect to MySQL server."
    Write-Error "Connection details: $($dbConfig.Username)@$($dbConfig.Host):$($dbConfig.Port)"
    Write-Host $testResult
    exit 1
}

Write-Success "Successfully connected to MySQL server"

# Create database
Write-Info "Creating database '$($dbConfig.Database)' if it doesn't exist..."
$createDbQuery = "CREATE DATABASE IF NOT EXISTS ``$($dbConfig.Database)`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

$createResult = & $mysqlPath $mysqlArgs -e $createDbQuery 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create database '$($dbConfig.Database)'"
    Write-Host $createResult
    exit 1
}

Write-Success "Database '$($dbConfig.Database)' is ready!"
Write-Info "You can now run: npm run prisma:migrate"
Write-Host ""

exit 0

