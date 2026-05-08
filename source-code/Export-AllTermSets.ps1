# Requires: PnP.PowerShell version 1.5.0
# Install example:
# Install-Module PnP.PowerShell -RequiredVersion 1.5.0 -Scope CurrentUser

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder,

    # Optional: restrict export to a single term group
    [Parameter(Mandatory = $false)]
    [string]$TermGroupName
)

$ErrorActionPreference = "Stop"

Write-Host "=== Export-AllTermSets.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl      : $SiteUrl"
Write-Host "TermGroupName: $(if ($TermGroupName) { $TermGroupName } else { '(all groups)' })"

if (-not $OutputFolder) {
    $OutputFolder = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
Write-Host "OutputFolder : $OutputFolder"
Write-Host ""

# --- Step 1: Verify PnP module ---
Write-Host "[1/5] Checking PnP.PowerShell module..." -ForegroundColor Yellow
$pnpModule = Get-Module -Name PnP.PowerShell -ListAvailable | Sort-Object Version -Descending | Select-Object -First 1
if (-not $pnpModule) {
    Write-Host "ERROR: PnP.PowerShell not found. Run: Install-Module PnP.PowerShell -RequiredVersion 1.5.0 -Scope CurrentUser" -ForegroundColor Red
    exit 1
}
Write-Host "  Found PnP.PowerShell v$($pnpModule.Version)" -ForegroundColor Green

# --- Step 2: Connect ---
Write-Host ""
Write-Host "[2/5] Connecting to SharePoint..." -ForegroundColor Yellow
Write-Host "  A browser window will open — complete sign-in to continue."
Write-Host ""

try {
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    Write-Host "  Connected successfully." -ForegroundColor Green
} catch {
    Write-Host "ERROR connecting: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# --- Step 3: Resolve term groups ---
Write-Host ""
Write-Host "[3/5] Retrieving term groups..." -ForegroundColor Yellow

try {
    $allGroups = @(Get-PnPTermGroup -ErrorAction Stop)
    Write-Host "  Total term groups found: $($allGroups.Count)" -ForegroundColor Green
    $allGroups | ForEach-Object { Write-Host "    - $($_.Name)" -ForegroundColor Gray }
} catch {
    Write-Host "ERROR retrieving term groups: $($_.Exception.Message)" -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

if ($TermGroupName) {
    $targetGroups = @($allGroups | Where-Object { $_.Name -eq $TermGroupName })
    if ($targetGroups.Count -eq 0) {
        Write-Host "ERROR: Term group '$TermGroupName' not found." -ForegroundColor Red
        Write-Host "Available groups:" -ForegroundColor Yellow
        $allGroups | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
        Disconnect-PnPOnline -ErrorAction SilentlyContinue
        exit 1
    }
} else {
    $targetGroups = $allGroups
}

Write-Host "  Exporting $($targetGroups.Count) group(s)." -ForegroundColor Green

# --- Step 4: Ensure output folder ---
Write-Host ""
Write-Host "[4/5] Preparing output folder..." -ForegroundColor Yellow
if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    Write-Host "  Created: $OutputFolder" -ForegroundColor Green
} else {
    Write-Host "  Exists : $OutputFolder" -ForegroundColor Green
}

# --- Helper: build recursive term tree ---
function Get-TermTree {
    param(
        [object]$TermSet,
        [object]$TermGroup,
        [object[]]$FlatTerms,
        [string]$ParentId = $null,
        [int]$Depth = 0
    )

    $children = @($FlatTerms | Where-Object {
        if ($Depth -eq 0) {
            # Root terms have no parent or parent equals the term set
            -not $_.TermsCount -and $_.PathOfTerm -notmatch ';'
        } else {
            $_.PathOfTerm -match "^.+;[^;]+$" -and
            ($_.PathOfTerm -split ';')[-2] -eq $ParentId
        }
    })

    # Simpler flat approach with depth indicated by PathOfTerm segments
    return @($FlatTerms | ForEach-Object {
        $path   = $_.PathOfTerm -split ';'
        $level  = $path.Count - 1
        [PSCustomObject]@{
            Name                 = $_.Name
            Id                   = $_.Id.ToString()
            Description          = $_.Description
            IsAvailableForTagging = $_.IsAvailableForTagging
            IsDeprecated         = $_.IsDeprecated
            PathOfTerm           = $_.PathOfTerm
            Depth                = $level
            ParentName           = if ($level -gt 0) { $path[$level - 1] } else { $null }
        }
    })
}

# --- Step 5: Export ---
Write-Host ""
Write-Host "[5/5] Exporting term sets..." -ForegroundColor Yellow

$exportedFiles   = @()
$summaryData     = [System.Collections.Generic.List[object]]::new()
$totalTermSets   = 0
$totalTerms      = 0

foreach ($group in $targetGroups) {
    $groupName = $group.Name
    Write-Host ""
    Write-Host "  Group: $groupName" -ForegroundColor Cyan

    # Get all term sets in the group
    try {
        $termSets = @(Get-PnPTermSet -TermGroup $group -ErrorAction Stop)
        Write-Host "    Term sets found: $($termSets.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "    WARNING: Could not retrieve term sets for '$groupName': $($_.Exception.Message)" -ForegroundColor Yellow
        continue
    }

    $groupSummary = [PSCustomObject]@{
        GroupName   = $groupName
        GroupId     = $group.Id.ToString()
        TermSetCount = $termSets.Count
        TermSets    = [System.Collections.Generic.List[object]]::new()
    }

    foreach ($termSet in $termSets) {
        $tsName = $termSet.Name
        Write-Host ""
        Write-Host "    >> $tsName" -ForegroundColor White

        # Get all terms recursively (flat list with PathOfTerm for hierarchy)
        try {
            $flatTerms = @(Get-PnPTerm -TermSet $termSet -TermGroup $group -Recursive -ErrorAction Stop)
            Write-Host "       Terms found: $($flatTerms.Count)" -ForegroundColor Gray
        } catch {
            Write-Host "       WARNING: Could not retrieve terms: $($_.Exception.Message)" -ForegroundColor Yellow
            $flatTerms = @()
        }

        # Build structured term list
        $termData = @($flatTerms | ForEach-Object {
            $path  = $_.PathOfTerm -split ';'
            $level = $path.Count - 1
            [PSCustomObject]@{
                Name                  = $_.Name
                Id                    = $_.Id.ToString()
                Description           = $_.Description
                IsAvailableForTagging = $_.IsAvailableForTagging
                IsDeprecated          = $_.IsDeprecated
                PathOfTerm            = $_.PathOfTerm
                Depth                 = $level
                ParentName            = if ($level -gt 0) { $path[$level - 1] } else { $null }
            }
        })

        # Per-term-set JSON file
        $safeGroup = ($groupName -replace '[\\/:*?"<>|]', '_')
        $safeTs    = ($tsName    -replace '[\\/:*?"<>|]', '_')
        $filePath  = Join-Path $OutputFolder "$safeGroup-$safeTs-TermSet.json"

        $output = [PSCustomObject]@{
            ExportedAt    = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
            SiteUrl       = $SiteUrl
            TermGroupName = $groupName
            TermGroupId   = $group.Id.ToString()
            TermSetName   = $tsName
            TermSetId     = $termSet.Id.ToString()
            Description   = $termSet.Description
            IsOpenForTermCreation = $termSet.IsOpenForTermCreation
            Contact       = $termSet.Contact
            TermCount     = $flatTerms.Count
            Terms         = $termData
        }

        $output | ConvertTo-Json -Depth 8 | Out-File -FilePath $filePath -Encoding utf8
        Write-Host "       [OK] $filePath" -ForegroundColor Green
        $exportedFiles += $filePath

        $groupSummary.TermSets.Add([PSCustomObject]@{
            TermSetName = $tsName
            TermSetId   = $termSet.Id.ToString()
            TermCount   = $flatTerms.Count
            OutputFile  = $filePath
        })

        $totalTermSets++
        $totalTerms += $flatTerms.Count
    }

    $summaryData.Add($groupSummary)
}

# -- Full hierarchy summary file --
$summaryPath = Join-Path $OutputFolder "TermSets-Summary.json"
[PSCustomObject]@{
    ExportedAt   = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    SiteUrl      = $SiteUrl
    TotalGroups  = $targetGroups.Count
    TotalTermSets = $totalTermSets
    TotalTerms   = $totalTerms
    Groups       = $summaryData
} | ConvertTo-Json -Depth 8 | Out-File -FilePath $summaryPath -Encoding utf8

Write-Host ""
Write-Host "  [OK] $summaryPath" -ForegroundColor Green
$exportedFiles += $summaryPath

# -- Summary --
Write-Host ""
Write-Host "--- Export Summary ---" -ForegroundColor Cyan
Write-Host "  Groups    : $($targetGroups.Count)"
Write-Host "  Term Sets : $totalTermSets"
Write-Host "  Terms     : $totalTerms"
Write-Host ""
$exportedFiles | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "=== Done! Output folder: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
