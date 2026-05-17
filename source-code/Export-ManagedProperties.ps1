# Requires: PnP.PowerShell >= 1.5.0
# Install: Install-Module PnP.PowerShell -Scope CurrentUser
#
# Managed Properties live in the tenant-level Search Schema, not at site scope.
# This script uses Get-PnPSearchConfiguration -Scope Subscription to export them.
# Requires: SharePoint Admin or Search Admin role.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://ruizfoods.sharepoint.com/sites/RuizNetPortal",

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder,

    # Optional: filter by name prefix (e.g. "RFP" returns RFPVendor, RFPAmount …)
    [Parameter(Mandatory = $false)]
    [string]$NameFilter
)

$ErrorActionPreference = "Stop"

Write-Host "=== Export-ManagedProperties.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl      : $SiteUrl"
Write-Host "NameFilter   : $(if ($NameFilter) { $NameFilter } else { '(all)' })"

# Resolve output folder
if (-not $OutputFolder) {
    $OutputFolder = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
Write-Host "OutputFolder : $OutputFolder"
Write-Host ""

# --- Step 1: Verify PnP module ---
Write-Host "[1/5] Checking PnP.PowerShell module..." -ForegroundColor Yellow
$pnpModule = Get-Module -Name PnP.PowerShell -ListAvailable |
             Sort-Object Version -Descending | Select-Object -First 1
if (-not $pnpModule) {
    Write-Host "ERROR: PnP.PowerShell module not found." -ForegroundColor Red
    Write-Host "Run: Install-Module PnP.PowerShell -Scope CurrentUser" -ForegroundColor Yellow
    exit 1
}
Write-Host "  Found PnP.PowerShell version $($pnpModule.Version)" -ForegroundColor Green

# --- Step 2: Connect ---
Write-Host ""
Write-Host "[2/5] Connecting to SharePoint..." -ForegroundColor Yellow
Write-Host "  A browser window will open — complete the sign-in to continue."
Write-Host ""

try {
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    Write-Host "  Connected successfully." -ForegroundColor Green
} catch {
    Write-Host "ERROR connecting: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# --- Step 3: Export tenant search schema (contains all Managed Properties) ---
Write-Host ""
Write-Host "[3/5] Retrieving tenant Search Schema (Managed Properties)..." -ForegroundColor Yellow
Write-Host "  Calling Get-PnPSearchConfiguration -Scope Subscription ..."

try {
    $rawConfig = Get-PnPSearchConfiguration -Scope Subscription
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "  This call requires SharePoint Admin or Search Admin rights." -ForegroundColor Yellow
    Write-Host "  If you are an admin, try connecting to the Admin Center URL:" -ForegroundColor Yellow
    $adminUrl = ($SiteUrl -replace "https://([^.]+)\.sharepoint\.com.*", 'https://$1-admin.sharepoint.com')
    Write-Host "    -SiteUrl `"$adminUrl`"" -ForegroundColor Yellow
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

# --- Step 4: Prepare output folder ---
Write-Host ""
Write-Host "[4/5] Preparing output folder..." -ForegroundColor Yellow
if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    Write-Host "  Created: $OutputFolder" -ForegroundColor Green
} else {
    Write-Host "  Exists : $OutputFolder" -ForegroundColor Green
}

# Save raw schema for reference / manual inspection
$rawPath = Join-Path $OutputFolder "SearchConfig-Raw.txt"
$rawConfig | Out-File -FilePath $rawPath -Encoding utf8
Write-Host "  Raw schema saved : $rawPath" -ForegroundColor Gray

# --- Parse raw config (JSON or XML depending on SPO version) ---
$allMPs = @()

$isJson = $rawConfig -and $rawConfig.Trim().StartsWith("{")

if ($isJson) {
    Write-Host "  Format detected  : JSON" -ForegroundColor Gray
    try {
        $config = $rawConfig | ConvertFrom-Json
        $allMPs = @($config.SearchSchemaConfigurationSettings.ManagedProperties.results)
    } catch {
        Write-Host "  WARNING: JSON parse failed — $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

if ($allMPs.Count -eq 0) {
    Write-Host "  Format detected  : XML" -ForegroundColor Gray
    try {
        [xml]$xmlConfig = $rawConfig
        # Use local-name() to avoid namespace issues
        $mpNodes = $xmlConfig.SelectNodes("//*[local-name()='ManagedPropertyInfo']")
        $allMPs = @($mpNodes | ForEach-Object {
            [PSCustomObject]@{
                Name                    = $_.Name
                ManagedType             = $_.ManagedType
                Searchable              = $_.Searchable
                Queryable               = $_.Queryable
                Retrievable             = $_.Retrievable
                RefinementEnabled       = $_.RefinementEnabled
                SortableType            = $_.SortableType
                SafeForAnonymous        = $_.SafeForAnonymous
                Aliases                 = $_.Aliases
                MappedCrawledProperties = $_.MappedCrawledProperties
                Description             = $_.Description
            }
        })
    } catch {
        Write-Host "  ERROR: XML parse failed — $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Inspect the raw file and report the format: $rawPath" -ForegroundColor Yellow
        Disconnect-PnPOnline -ErrorAction SilentlyContinue
        exit 1
    }
}

Write-Host "  Total Managed Properties found: $($allMPs.Count)" -ForegroundColor Green

if ($allMPs.Count -eq 0) {
    Write-Host "  WARNING: No managed properties could be parsed." -ForegroundColor Yellow
    Write-Host "  The raw schema was saved to: $rawPath" -ForegroundColor Yellow
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 0
}

# Apply name filter
if ($NameFilter) {
    $filtered = @($allMPs | Where-Object { $_.Name -like "$NameFilter*" })
    Write-Host "  After filter '$NameFilter*': $($filtered.Count)" -ForegroundColor Green
} else {
    $filtered = @($allMPs)
}

# --- Step 5: Export ---
Write-Host ""
Write-Host "[5/5] Exporting data..." -ForegroundColor Yellow

# Normalize to consistent PSCustomObjects (handles both JSON and XML source shapes)
$exportData = @($filtered | ForEach-Object {
    $aliases = if ($_.Aliases -is [array]) { $_.Aliases -join "; " }
               elseif ($_.Aliases.results) { $_.Aliases.results -join "; " }
               else { [string]$_.Aliases }

    $crawled = if ($_.MappedCrawledProperties -is [array]) { $_.MappedCrawledProperties -join "; " }
               elseif ($_.MappedCrawledProperties.results) { $_.MappedCrawledProperties.results -join "; " }
               else { [string]$_.MappedCrawledProperties }

    [PSCustomObject]@{
        Name                    = $_.Name
        ManagedType             = $_.ManagedType
        Searchable              = $_.Searchable
        Queryable               = $_.Queryable
        Retrievable             = $_.Retrievable
        RefinementEnabled       = $_.RefinementEnabled
        SortableType            = $_.SortableType
        SafeForAnonymous        = $_.SafeForAnonymous
        Aliases                 = $aliases
        MappedCrawledProperties = $crawled
        Description             = $_.Description
    }
})

# 5a. Flat JSON — all (or filtered) MPs
$flatFile = Join-Path $OutputFolder "ManagedProperties.json"
$exportData | ConvertTo-Json -Depth 5 | Out-File -FilePath $flatFile -Encoding utf8
Write-Host "  [OK] $flatFile" -ForegroundColor Green

# 5b. Grouped by ManagedType
$byType = $exportData | Group-Object -Property ManagedType | Sort-Object Name
$byTypeData = @($byType | ForEach-Object {
    [PSCustomObject]@{
        ManagedType = $_.Name
        Count       = $_.Count
        Properties  = @($_.Group | Select-Object Name, Searchable, Retrievable)
    }
})
$byTypeFile = Join-Path $OutputFolder "ManagedProperties-ByType.json"
$byTypeData | ConvertTo-Json -Depth 5 | Out-File -FilePath $byTypeFile -Encoding utf8
Write-Host "  [OK] $byTypeFile" -ForegroundColor Green

# 5c. Refinable MPs only (useful for building KQL filters)
$refinable = @($exportData | Where-Object { $_.RefinementEnabled -eq $true -or $_.RefinementEnabled -eq "true" })
if ($refinable.Count -gt 0) {
    $refinableFile = Join-Path $OutputFolder "ManagedProperties-Refinable.json"
    $refinable | Select-Object Name, ManagedType, Aliases, MappedCrawledProperties |
        ConvertTo-Json -Depth 5 |
        Out-File -FilePath $refinableFile -Encoding utf8
    Write-Host "  [OK] $refinableFile  ($($refinable.Count) refinable)" -ForegroundColor Green
}

# Summary table
Write-Host ""
Write-Host "--- Managed Properties by Type ---" -ForegroundColor Cyan
$byType | ForEach-Object {
    Write-Host ("  {0,-20} {1,4} properties" -f $_.Name, $_.Count)
}

Write-Host ""
Write-Host "=== Done! Output folder: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
