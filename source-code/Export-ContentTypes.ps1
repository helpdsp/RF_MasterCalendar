# Requires: PnP.PowerShell >= 1.5.0
# Install: Install-Module PnP.PowerShell -Scope CurrentUser

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://ruizfoods.sharepoint.com/sites/RuizNetPortal",

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder,

    # Optional: filter by content type group name (e.g. "Tax Team Content Types")
    [Parameter(Mandatory = $false)]
    [string]$ContentTypeGroup
)

$ErrorActionPreference = "Stop"

Write-Host "=== Export-ContentTypes.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl          : $SiteUrl"
Write-Host "ContentTypeGroup : $(if ($ContentTypeGroup) { $ContentTypeGroup } else { '(all groups)' })"

# Resolve output folder
if (-not $OutputFolder) {
    $OutputFolder = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
Write-Host "OutputFolder     : $OutputFolder"
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

# --- Step 3: Retrieve content types ---
Write-Host ""
Write-Host "[3/5] Retrieving site content types..." -ForegroundColor Yellow

try {
    $allCTs = @(Get-PnPContentType -ErrorAction Stop)
} catch {
    Write-Host "ERROR retrieving content types: $($_.Exception.Message)" -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

Write-Host "  Total content types found: $($allCTs.Count)" -ForegroundColor Green

if ($allCTs.Count -eq 0) {
    Write-Host "ERROR: No content types returned from site." -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

# Apply group filter
if ($ContentTypeGroup) {
    $filtered = @($allCTs | Where-Object { $_.Group -eq $ContentTypeGroup })
    Write-Host "  Content types in group '$ContentTypeGroup': $($filtered.Count)" -ForegroundColor Green
    if ($filtered.Count -eq 0) {
        Write-Host "  WARNING: No content types found for that group." -ForegroundColor Yellow
        Write-Host "  Available groups:" -ForegroundColor Yellow
        $allCTs | Group-Object Group | Sort-Object Name | ForEach-Object {
            Write-Host "    - $($_.Name) ($($_.Count) content types)" -ForegroundColor Gray
        }
    }
} else {
    $filtered = $allCTs
}

# Load field links for each content type
Write-Host "  Loading field links for $($filtered.Count) content type(s)..." -ForegroundColor Yellow
$ctWithFields = [System.Collections.Generic.List[object]]::new()

foreach ($ct in $filtered) {
    $fields = @()
    try {
        # Load the FieldLinks collection via CSOM
        Get-PnPProperty -ClientObject $ct -Property FieldLinks | Out-Null
        $fields = @($ct.FieldLinks | ForEach-Object {
            [PSCustomObject]@{
                Name         = $_.Name
                Id           = $_.Id.ToString()
                Required     = $_.Required
                Hidden       = $_.Hidden
                DisplayName  = $_.DisplayName
            }
        })
    } catch {
        # FieldLinks may not load for built-in sealed CTs — skip silently
    }

    $ctWithFields.Add([PSCustomObject]@{
        Id               = $ct.Id.StringValue
        Name             = $ct.Name
        Group            = $ct.Group
        Description      = $ct.Description
        Hidden           = $ct.Hidden
        ReadOnly         = $ct.ReadOnly
        Sealed           = $ct.Sealed
        DocumentTemplate = $ct.DocumentTemplate
        FieldCount       = $fields.Count
        Fields           = $fields
    })
}

Write-Host "  Field links loaded." -ForegroundColor Green

# --- Step 4: Prepare output folder ---
Write-Host ""
Write-Host "[4/5] Preparing output folder..." -ForegroundColor Yellow
if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    Write-Host "  Created: $OutputFolder" -ForegroundColor Green
} else {
    Write-Host "  Exists : $OutputFolder" -ForegroundColor Green
}

# --- Step 5: Export ---
Write-Host ""
Write-Host "[5/5] Exporting data..." -ForegroundColor Yellow

# 5a. Full detail (all content types with their fields) -> JSON
$safeName = if ($ContentTypeGroup) {
    ($ContentTypeGroup -replace '[\\/:*?"<>|]', '_') + "-ContentTypes.json"
} else {
    "ContentTypes.json"
}
$fullPath = Join-Path $OutputFolder $safeName
$ctWithFields | ConvertTo-Json -Depth 6 | Out-File -FilePath $fullPath -Encoding utf8
Write-Host "  [OK] $fullPath" -ForegroundColor Green

# 5b. Summary (no field detail) grouped by group -> JSON
$groupsSummary = $ctWithFields | Group-Object -Property Group | Sort-Object Name
$summaryData = @($groupsSummary | ForEach-Object {
    [PSCustomObject]@{
        GroupName        = $_.Name
        ContentTypeCount = $_.Count
        ContentTypes     = @($_.Group | ForEach-Object {
            [PSCustomObject]@{
                Name       = $_.Name
                Id         = $_.Id
                FieldCount = $_.FieldCount
                Hidden     = $_.Hidden
                Sealed     = $_.Sealed
            }
        })
    }
})
$summaryPath = Join-Path $OutputFolder "ContentTypes-ByGroup.json"
$summaryData | ConvertTo-Json -Depth 5 | Out-File -FilePath $summaryPath -Encoding utf8
Write-Host "  [OK] $summaryPath" -ForegroundColor Green

# 5c. Flat field-to-content-type mapping -> JSON (useful for cross-referencing columns)
$fieldMap = [System.Collections.Generic.List[object]]::new()
foreach ($ct in $ctWithFields) {
    foreach ($f in $ct.Fields) {
        $fieldMap.Add([PSCustomObject]@{
            ContentTypeName = $ct.Name
            ContentTypeId   = $ct.Id
            Group           = $ct.Group
            FieldName       = $f.Name
            FieldId         = $f.Id
            Required        = $f.Required
            Hidden          = $f.Hidden
        })
    }
}
if ($fieldMap.Count -gt 0) {
    $fieldMapPath = Join-Path $OutputFolder "ContentTypes-FieldMap.json"
    $fieldMap | ConvertTo-Json -Depth 4 | Out-File -FilePath $fieldMapPath -Encoding utf8
    Write-Host "  [OK] $fieldMapPath  ($($fieldMap.Count) field-to-CT mappings)" -ForegroundColor Green
}

# Summary table
Write-Host ""
Write-Host "--- Content Types by Group ---" -ForegroundColor Cyan
$groupsSummary | ForEach-Object {
    Write-Host ("  {0,-45} {1,3} content type(s)" -f $_.Name, $_.Count)
}

Write-Host ""
Write-Host "=== Done! Output folder: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
