# Requires: PnP.PowerShell
# Install: Install-Module PnP.PowerShell -Scope CurrentUser
#
# Exports list settings and views for one list or all non-system lists.
# Complements Export-ListSchema.ps1 (raw XML) with structured, readable JSON.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://ruizfoods.sharepoint.com/sites/RuizNetPortal",

    [Parameter(Mandatory = $false)]
    [string]$ListName,          # If omitted, all non-hidden, non-system lists are exported

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder
)

$ErrorActionPreference = "Stop"

Write-Host "=== Export-ListSettings.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl    : $SiteUrl"
Write-Host "ListName   : $(if ($ListName) { $ListName } else { '(all non-system lists)' })"

if (-not $OutputFolder) {
    $OutputFolder = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
Write-Host "OutputFolder: $OutputFolder"
Write-Host ""

# --- Step 1: Verify PnP module ---
Write-Host "[1/5] Checking PnP.PowerShell module..." -ForegroundColor Yellow
$pnpModule = Get-Module -Name PnP.PowerShell -ListAvailable | Sort-Object Version -Descending | Select-Object -First 1
if (-not $pnpModule) {
    Write-Host "ERROR: PnP.PowerShell not found. Run: Install-Module PnP.PowerShell -Scope CurrentUser" -ForegroundColor Red
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

# --- Step 3: Resolve target lists ---
Write-Host ""
Write-Host "[3/5] Resolving lists..." -ForegroundColor Yellow

$SYSTEM_TEMPLATES = @(
    100,  # Generic list (only excluded if Hidden)
    101,  # Document library (only excluded if Hidden)
    544,  # MicroFeed
    700,  # Solution Gallery
    850,  # Pages Library (keep - may be relevant)
    1100, # Issue Tracking — keep
    110,  # Picture Library — keep
    120,  # Forms library
    130,  # Web Part Gallery
    200,  # Meetings
    201,  # Agenda
    202,  # Meeting Attendees
    204,  # Decision
    207,  # Meeting Objectives
    210,  # TextBox
    212,  # Things To Bring
    216,  # Home Page Library
    300,  # Portal Sites
    301,  # Blog Posts
    302,  # Blog Comments
    303,  # Blog Categories
    400,  # Survey
    600,  # External List
    3100, # Data Sources
    3120, # No Code Public
    3130, # No Code Workflows
    3531, # KPI Statuses
    3570, # External Data
    4700, # Reporting Metadata
    4710, # Reporting L1
    4720, # Reporting L2
    171,  # Master Page Gallery
    114,  # Site Pages
    210   # Web Template Extensions
)

try {
    if ($ListName) {
        $targetLists = @(Get-PnPList -Identity $ListName -ErrorAction Stop)
        if (-not $targetLists) { throw "List '$ListName' not found." }
    } else {
        $allLists = @(Get-PnPList -ErrorAction Stop)
        $targetLists = @($allLists | Where-Object {
            -not $_.Hidden -and
            -not ($SYSTEM_TEMPLATES -contains $_.BaseTemplate -and $_.Hidden)
        } | Sort-Object Title)
        Write-Host "  Found $($targetLists.Count) lists to export (from $($allLists.Count) total)" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR retrieving lists: $($_.Exception.Message)" -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

if ($targetLists.Count -eq 0) {
    Write-Host "No lists to export." -ForegroundColor Yellow
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 0
}

# --- Step 4: Ensure output folder ---
Write-Host ""
Write-Host "[4/5] Preparing output folder..." -ForegroundColor Yellow
if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    Write-Host "  Created: $OutputFolder" -ForegroundColor Green
} else {
    Write-Host "  Exists : $OutputFolder" -ForegroundColor Green
}

# --- Step 5: Export each list ---
Write-Host ""
Write-Host "[5/5] Exporting list settings..." -ForegroundColor Yellow

$exportedFiles = @()

foreach ($list in $targetLists) {
    $listTitle = $list.Title
    Write-Host ""
    Write-Host "  >> $listTitle" -ForegroundColor Cyan

    # -- List Settings --
    Write-Host "     Reading settings..." -ForegroundColor Gray
    try {
        $listDetail = Get-PnPList -Identity $listTitle -Includes `
            ContentTypes, `
            HasUniqueRoleAssignments, `
            IrmEnabled, `
            NoCrawl, `
            EnableFolderCreation, `
            EnableAttachments, `
            ValidationFormula, `
            ValidationMessage, `
            ReadSecurity, `
            WriteSecurity, `
            MajorVersionLimit, `
            MajorWithMinorVersionsLimit `
            -ErrorAction Stop
    } catch {
        Write-Host "     WARNING: Could not load full details for '$listTitle': $($_.Exception.Message)" -ForegroundColor Yellow
        $listDetail = $list
    }

    $settings = [PSCustomObject]@{
        # Identity
        Title                     = $listDetail.Title
        Id                        = $listDetail.Id.ToString()
        ServerRelativeUrl         = $listDetail.RootFolder.ServerRelativeUrl
        DefaultViewUrl            = $listDetail.DefaultViewUrl

        # Template / Type
        BaseTemplate              = $listDetail.BaseTemplate
        BaseType                  = $listDetail.BaseType.ToString()

        # General
        Description               = $listDetail.Description
        ItemCount                 = $listDetail.ItemCount
        Hidden                    = $listDetail.Hidden
        OnQuickLaunch             = $listDetail.OnQuickLaunch

        # Versioning
        EnableVersioning          = $listDetail.EnableVersioning
        EnableMinorVersions       = $listDetail.EnableMinorVersions
        EnableModeration          = $listDetail.EnableModeration
        ForceCheckout             = $listDetail.ForceCheckout
        MajorVersionLimit         = $listDetail.MajorVersionLimit
        MajorWithMinorVersionsLimit = $listDetail.MajorWithMinorVersionsLimit

        # Content & Attachments
        ContentTypesEnabled       = $listDetail.ContentTypesEnabled
        EnableAttachments         = $listDetail.EnableAttachments
        EnableFolderCreation      = $listDetail.EnableFolderCreation

        # Security
        HasUniqueRoleAssignments  = $listDetail.HasUniqueRoleAssignments
        ReadSecurity              = $listDetail.ReadSecurity
        WriteSecurity             = $listDetail.WriteSecurity
        IrmEnabled                = $listDetail.IrmEnabled
        NoCrawl                   = $listDetail.NoCrawl

        # Validation
        ValidationFormula         = $listDetail.ValidationFormula
        ValidationMessage         = $listDetail.ValidationMessage

        # Content Types
        ContentTypes              = @(
            try {
                $listDetail.ContentTypes | ForEach-Object {
                    [PSCustomObject]@{
                        Name   = $_.Name
                        Id     = $_.Id.StringValue
                        Hidden = $_.Hidden
                    }
                }
            } catch { @() }
        )
    }

    # -- Views --
    Write-Host "     Reading views..." -ForegroundColor Gray
    try {
        $rawViews = @(Get-PnPView -List $listTitle -ErrorAction Stop)
        $views = @($rawViews | Sort-Object Title | ForEach-Object {
            [PSCustomObject]@{
                Title             = $_.Title
                Id                = $_.Id.ToString()
                ServerRelativeUrl = $_.ServerRelativeUrl
                DefaultView       = $_.DefaultView
                Hidden            = $_.Hidden
                PersonalView      = $_.PersonalView
                ViewType          = $_.ViewType.ToString()
                Paged             = $_.Paged
                RowLimit          = $_.RowLimit
                TabularView       = $_.TabularView
                ViewFields        = @($_.ViewFields)      # columns shown in the view
                ViewQuery         = $_.ViewQuery           # CAML filter/sort
                ViewJoins         = $_.ViewJoins
                ViewProjectedFields = $_.ViewProjectedFields
            }
        })
        Write-Host "     Views found: $($views.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "     WARNING: Could not read views: $($_.Exception.Message)" -ForegroundColor Yellow
        $views = @()
    }

    # -- Fields (columns on this list) --
    Write-Host "     Reading fields..." -ForegroundColor Gray
    try {
        $fields = @(Get-PnPField -List $listTitle -ErrorAction Stop | Sort-Object Title | ForEach-Object {
            $choices = @()
            if ($_.TypeAsString -in @("Choice", "MultiChoice")) {
                try { $choices = @($_.Choices) } catch { $choices = @() }
            }

            [PSCustomObject]@{
                Title            = $_.Title
                InternalName     = $_.InternalName
                StaticName       = $_.StaticName
                Id               = $_.Id.ToString()
                TypeAsString     = $_.TypeAsString
                Required         = $_.Required
                Hidden           = $_.Hidden
                ReadOnlyField    = $_.ReadOnlyField
                EnforceUniqueValues = $_.EnforceUniqueValues
                Indexed          = $_.Indexed
                Group            = $_.Group
                DefaultValue     = $_.DefaultValue
                Description      = $_.Description
                Choices          = $choices
                LookupList       = $_.LookupList
                LookupField      = $_.LookupField
                CustomFormatter  = $_.CustomFormatter
                JSLink           = $_.JSLink
                SchemaXml        = $_.SchemaXml
            }
        })
        Write-Host "     Fields found: $($fields.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "     WARNING: Could not read fields: $($_.Exception.Message)" -ForegroundColor Yellow
        $fields = @()
    }

    # -- Assemble & write output --
    $output = [PSCustomObject]@{
        ExportedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        SiteUrl    = $SiteUrl
        Settings   = $settings
        Views      = $views
        Fields     = $fields
    }

    $safeName   = ($listTitle -replace '[\\/:*?"<>|]', '_')
    $outputPath = Join-Path $OutputFolder "$safeName-ListSettings.json"
    $output | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputPath -Encoding utf8
    Write-Host "     [OK] $outputPath" -ForegroundColor Green
    $exportedFiles += $outputPath
}

# -- Summary --
Write-Host ""
Write-Host "--- Export Summary ---" -ForegroundColor Cyan
$exportedFiles | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "=== Done! $($exportedFiles.Count) list(s) exported to: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
