# Requires: PnP.PowerShell version 1.5.0
# Install example:
# Install-Module PnP.PowerShell -RequiredVersion 1.5.0 -Scope CurrentUser

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $false)]
    [string]$LibraryName,       # If omitted, all non-hidden document libraries are exported

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder,

    [Parameter(Mandatory = $false)]
    [switch]$IncludeHidden      # Include hidden system libraries when exporting all
)

$ErrorActionPreference = "Stop"

Write-Host "=== Export-Library.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl     : $SiteUrl"
Write-Host "LibraryName : $(if ($LibraryName) { $LibraryName } else { '(all document libraries)' })"
Write-Host "IncludeHidden: $($IncludeHidden.IsPresent)"

if (-not $OutputFolder) {
    $OutputFolder = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
}
Write-Host "OutputFolder: $OutputFolder"
Write-Host ""

# System library titles to skip when exporting all (hidden or infrastructure libraries)
$SYSTEM_LIBRARY_TITLES = @(
    'Style Library',
    'Form Templates',
    'Site Assets',
    'Site Collection Images',
    'Site Collection Documents',
    'Preservation Hold Library',
    'Pages',
    'Master Page Gallery',
    'Theme Gallery',
    'Solution Gallery',
    'Web Template Extensions',
    '_catalogs/hubsite'
)

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

# --- Step 3: Resolve target libraries ---
Write-Host ""
Write-Host "[3/5] Resolving document libraries..." -ForegroundColor Yellow

try {
    if ($LibraryName) {
        $lib = Get-PnPList -Identity $LibraryName -ErrorAction Stop
        if (-not $lib) { throw "Library '$LibraryName' not found." }
        if ($lib.BaseType -ne 1) { throw "'$LibraryName' is not a document library (BaseType=$($lib.BaseType))." }
        $targetLibraries = @($lib)
    } else {
        $allLists = @(Get-PnPList -ErrorAction Stop)
        $targetLibraries = @($allLists | Where-Object {
            $_.BaseType -eq 1 -and                                      # document libraries only
            ($IncludeHidden -or -not $_.Hidden) -and                    # skip hidden unless flag set
            ($SYSTEM_LIBRARY_TITLES -notcontains $_.Title)              # skip known system libraries
        } | Sort-Object Title)
        Write-Host "  Found $($targetLibraries.Count) document libraries (from $($allLists.Count) total lists)" -ForegroundColor Green
    }
} catch {
    Write-Host "ERROR retrieving libraries: $($_.Exception.Message)" -ForegroundColor Red
    Disconnect-PnPOnline -ErrorAction SilentlyContinue
    exit 1
}

if ($targetLibraries.Count -eq 0) {
    Write-Host "No document libraries to export." -ForegroundColor Yellow
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

# --- Step 5: Export each library ---
Write-Host ""
Write-Host "[5/5] Exporting document libraries..." -ForegroundColor Yellow

$exportedFiles  = @()
$exportedCount  = 0
$skippedCount   = 0

foreach ($library in $targetLibraries) {
    $libTitle = $library.Title
    Write-Host ""
    Write-Host "  >> $libTitle" -ForegroundColor Cyan

    # -- Full list detail with all document-library-relevant includes --
    Write-Host "     Reading library settings..." -ForegroundColor Gray
    try {
        $libDetail = Get-PnPList -Identity $libTitle -Includes `
            ContentTypes, `
            HasUniqueRoleAssignments, `
            IrmEnabled, `
            IrmExpire, `
            IrmReject, `
            NoCrawl, `
            EnableFolderCreation, `
            ValidationFormula, `
            ValidationMessage, `
            ReadSecurity, `
            WriteSecurity, `
            MajorVersionLimit, `
            MajorWithMinorVersionsLimit, `
            DefaultContentApprovalWorkflowId, `
            RootFolder `
            -ErrorAction Stop
    } catch {
        Write-Host "     WARNING: Could not load full details for '$libTitle': $($_.Exception.Message)" -ForegroundColor Yellow
        $libDetail = $library
    }

    $settings = [PSCustomObject]@{
        # Identity
        Title                           = $libDetail.Title
        Id                              = $libDetail.Id.ToString()
        ServerRelativeUrl               = $libDetail.RootFolder.ServerRelativeUrl
        DefaultViewUrl                  = $libDetail.DefaultViewUrl

        # Template / Type
        BaseTemplate                    = $libDetail.BaseTemplate
        BaseType                        = $libDetail.BaseType.ToString()

        # General
        Description                     = $libDetail.Description
        ItemCount                       = $libDetail.ItemCount
        Hidden                          = $libDetail.Hidden
        OnQuickLaunch                   = $libDetail.OnQuickLaunch
        NoCrawl                         = $libDetail.NoCrawl

        # Versioning
        EnableVersioning                = $libDetail.EnableVersioning
        EnableMinorVersions             = $libDetail.EnableMinorVersions
        EnableModeration                = $libDetail.EnableModeration        # Require approval
        ForceCheckout                   = $libDetail.ForceCheckout
        MajorVersionLimit               = $libDetail.MajorVersionLimit
        MajorWithMinorVersionsLimit     = $libDetail.MajorWithMinorVersionsLimit
        DefaultContentApprovalWorkflowId = $libDetail.DefaultContentApprovalWorkflowId.ToString()

        # Content Types & Folders
        ContentTypesEnabled             = $libDetail.ContentTypesEnabled
        EnableFolderCreation            = $libDetail.EnableFolderCreation

        # Information Rights Management (IRM)
        IrmEnabled                      = $libDetail.IrmEnabled
        IrmExpire                       = $libDetail.IrmExpire
        IrmReject                       = $libDetail.IrmReject

        # Security
        HasUniqueRoleAssignments        = $libDetail.HasUniqueRoleAssignments
        ReadSecurity                    = $libDetail.ReadSecurity
        WriteSecurity                   = $libDetail.WriteSecurity

        # Validation
        ValidationFormula               = $libDetail.ValidationFormula
        ValidationMessage               = $libDetail.ValidationMessage

        # Content Types assigned to this library
        ContentTypes                    = @(
            try {
                $libDetail.ContentTypes | ForEach-Object {
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
        $views = @(Get-PnPView -List $libTitle -ErrorAction Stop | Sort-Object Title | ForEach-Object {
            [PSCustomObject]@{
                Title               = $_.Title
                Id                  = $_.Id.ToString()
                ServerRelativeUrl   = $_.ServerRelativeUrl
                DefaultView         = $_.DefaultView
                Hidden              = $_.Hidden
                PersonalView        = $_.PersonalView
                ViewType            = $_.ViewType.ToString()
                Paged               = $_.Paged
                RowLimit            = $_.RowLimit
                TabularView         = $_.TabularView
                ViewFields          = @($_.ViewFields)
                ViewQuery           = $_.ViewQuery
                ViewJoins           = $_.ViewJoins
                ViewProjectedFields = $_.ViewProjectedFields
            }
        })
        Write-Host "     Views found: $($views.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "     WARNING: Could not read views: $($_.Exception.Message)" -ForegroundColor Yellow
        $views = @()
    }

    # -- Fields --
    Write-Host "     Reading fields..." -ForegroundColor Gray
    try {
        $fields = @(Get-PnPField -List $libTitle -ErrorAction Stop | Sort-Object Title | ForEach-Object {
            [PSCustomObject]@{
                Title           = $_.Title
                InternalName    = $_.InternalName
                Id              = $_.Id.ToString()
                TypeAsString    = $_.TypeAsString
                Required        = $_.Required
                Hidden          = $_.Hidden
                ReadOnlyField   = $_.ReadOnlyField
                Group           = $_.Group
                DefaultValue    = $_.DefaultValue
                Description     = $_.Description
                SchemaXml       = $_.SchemaXml
            }
        })
        Write-Host "     Fields found: $($fields.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "     WARNING: Could not read fields: $($_.Exception.Message)" -ForegroundColor Yellow
        $fields = @()
    }

    # -- Schema XML --
    Write-Host "     Reading schema XML..." -ForegroundColor Gray
    try {
        $schemaXml = (Get-PnPList -Identity $libTitle -Includes SchemaXml -ErrorAction Stop).SchemaXml
    } catch {
        Write-Host "     WARNING: Could not read schema XML: $($_.Exception.Message)" -ForegroundColor Yellow
        $schemaXml = $null
    }

    # -- Folder structure (top-level only) --
    Write-Host "     Reading folder structure..." -ForegroundColor Gray
    try {
        $rootFolder  = Get-PnPFolder -Url $libDetail.RootFolder.ServerRelativeUrl -ErrorAction Stop
        $subFolders  = @(Get-PnPFolderItem -FolderSiteRelativeUrl $libDetail.RootFolder.ServerRelativeUrl `
                            -ItemType Folder -ErrorAction Stop | ForEach-Object {
            [PSCustomObject]@{
                Name              = $_.Name
                ServerRelativeUrl = $_.ServerRelativeUrl
            }
        })
        Write-Host "     Top-level folders: $($subFolders.Count)" -ForegroundColor Gray
    } catch {
        Write-Host "     WARNING: Could not read folder structure: $($_.Exception.Message)" -ForegroundColor Yellow
        $subFolders = @()
    }

    # -- Assemble & write JSON --
    $safeName = ($libTitle -replace '[\\/:*?"<>|]', '_')

    $output = [PSCustomObject]@{
        ExportedAt    = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        SiteUrl       = $SiteUrl
        Settings      = $settings
        Views         = $views
        Fields        = $fields
        TopLevelFolders = $subFolders
    }

    $jsonPath = Join-Path $OutputFolder "$safeName-Library.json"
    $output | ConvertTo-Json -Depth 10 | Out-File -FilePath $jsonPath -Encoding utf8
    Write-Host "     [OK] $jsonPath" -ForegroundColor Green
    $exportedFiles += $jsonPath

    # -- Write schema XML separately --
    if ($schemaXml) {
        $xmlPath = Join-Path $OutputFolder "$safeName-Library-Schema.xml"
        $schemaXml | Out-File -FilePath $xmlPath -Encoding utf8
        Write-Host "     [OK] $xmlPath" -ForegroundColor Green
        $exportedFiles += $xmlPath
    }

    $exportedCount++
}

# -- Summary --
Write-Host ""
Write-Host "--- Export Summary ---" -ForegroundColor Cyan
$exportedFiles | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "=== Done! $exportedCount library(s) exported to: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
