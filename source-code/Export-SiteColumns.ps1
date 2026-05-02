# Requires: PnP.PowerShell
# Install: Install-Module PnP.PowerShell -Scope CurrentUser

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder,

    [Parameter(Mandatory = $false)]
    [string]$ColumnGroup
)

$ErrorActionPreference = "Stop"

Write-Host "=== Export-SiteColumns.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl      : $SiteUrl"
Write-Host "ColumnGroup  : $(if ($ColumnGroup) { $ColumnGroup } else { '(all groups)' })"

# Resolve output folder
if (-not $OutputFolder) {
    $OutputFolder = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
Write-Host "OutputFolder : $OutputFolder"
Write-Host ""

# --- Step 1: Verify PnP module is available ---
Write-Host "[1/5] Checking PnP.PowerShell module..." -ForegroundColor Yellow
$pnpModule = Get-Module -Name PnP.PowerShell -ListAvailable | Sort-Object Version -Descending | Select-Object -First 1
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

# --- Step 3: Retrieve fields ---
Write-Host ""
Write-Host "[3/5] Retrieving site columns..." -ForegroundColor Yellow

try {
    $allFields = @(Get-PnPField -ErrorAction Stop)
} catch {
    Write-Host "ERROR retrieving fields: $($_.Exception.Message)" -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "  Total fields found: $($allFields.Count)" -ForegroundColor Green

if ($allFields.Count -eq 0) {
    Write-Host "ERROR: No fields returned from site." -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

# Apply group filter
if ($ColumnGroup) {
    $fields = @($allFields | Where-Object { $_.Group -eq $ColumnGroup })
    Write-Host "  Fields in group '$ColumnGroup': $($fields.Count)" -ForegroundColor Green
    if ($fields.Count -eq 0) {
        Write-Host "  WARNING: No columns found for group '$ColumnGroup'." -ForegroundColor Yellow
        Write-Host "  Available groups:" -ForegroundColor Yellow
        $allFields | Group-Object Group | Sort-Object Name | ForEach-Object {
            Write-Host "    - $($_.Name) ($($_.Count) columns)" -ForegroundColor Gray
        }
    }
} else {
    $fields = $allFields
}

# --- Step 4: Ensure output folder exists ---
Write-Host ""
Write-Host "[4/5] Preparing output folder..." -ForegroundColor Yellow
if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    Write-Host "  Created: $OutputFolder" -ForegroundColor Green
} else {
    Write-Host "  Exists : $OutputFolder" -ForegroundColor Green
}

# --- Step 5: Export files ---
Write-Host ""
Write-Host "[5/5] Exporting data..." -ForegroundColor Yellow

# 5a. All (or filtered) columns -> JSON
$columnsData = @($fields | ForEach-Object {
    [PSCustomObject]@{
        Title         = $_.Title
        InternalName  = $_.InternalName
        Id            = $_.Id.ToString()
        TypeAsString  = $_.TypeAsString
        Group         = $_.Group
        Required      = $_.Required
        Hidden        = $_.Hidden
        ReadOnlyField = $_.ReadOnlyField
        Description   = $_.Description
    }
})

$safeName = if ($ColumnGroup) {
    ($ColumnGroup -replace '[\\/:*?"<>|]', '_') + "-SiteColumns.json"
} else {
    "AllSiteColumns.json"
}
$columnsPath = Join-Path $OutputFolder $safeName
$columnsData | ConvertTo-Json -Depth 5 | Out-File -FilePath $columnsPath -Encoding utf8
Write-Host "  [OK] $columnsPath" -ForegroundColor Green

# 5b. Columns grouped by group -> JSON
$groupsSummary = $fields | Group-Object -Property Group | Sort-Object Name
$groupsData = @($groupsSummary | ForEach-Object {
    [PSCustomObject]@{
        GroupName   = $_.Name
        ColumnCount = $_.Count
        Columns     = @($_.Group | ForEach-Object {
            [PSCustomObject]@{
                Title        = $_.Title
                InternalName = $_.InternalName
                TypeAsString = $_.TypeAsString
            }
        })
    }
})
$groupsPath = Join-Path $OutputFolder "SiteColumns-ByGroup.json"
$groupsData | ConvertTo-Json -Depth 5 | Out-File -FilePath $groupsPath -Encoding utf8
Write-Host "  [OK] $groupsPath" -ForegroundColor Green

# 5c. Lookup / Choice / MultiChoice details -> JSON
$specialColumns = @($fields | Where-Object { $_.TypeAsString -in @("Lookup", "Choice", "MultiChoice") } | ForEach-Object {
    [PSCustomObject]@{
        Title        = $_.Title
        InternalName = $_.InternalName
        Type         = $_.TypeAsString
        Group        = $_.Group
    }
})
if ($specialColumns.Count -gt 0) {
    $specialPath = Join-Path $OutputFolder "SiteColumns-Special.json"
    $specialColumns | ConvertTo-Json -Depth 5 | Out-File -FilePath $specialPath -Encoding utf8
    Write-Host "  [OK] $specialPath  ($($specialColumns.Count) special columns)" -ForegroundColor Green
}

# Summary table
Write-Host ""
Write-Host "--- Columns by Group ---" -ForegroundColor Cyan
$groupsSummary | ForEach-Object {
    Write-Host ("  {0,-40} {1,4} columns" -f $_.Name, $_.Count)
}

Write-Host ""
Write-Host "=== Done! Output folder: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
