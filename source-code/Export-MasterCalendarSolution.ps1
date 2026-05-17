# Requires: PnP.PowerShell >= 1.5.0
# Install: Install-Module PnP.PowerShell -Scope CurrentUser
#
# Exports the SharePoint Online technical inventory for the Ruiz Foods
# Master Calendar solution hosted in RuizNetPortal.

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$SiteUrl = "https://ruizfoods.sharepoint.com/sites/RuizNetPortal",

    [Parameter(Mandatory = $false)]
    [string[]]$ListNames = @("Master Calendar", "Master Calendar Sync"),

    [Parameter(Mandatory = $false)]
    [string]$OutputFolder,

    [Parameter(Mandatory = $false)]
    [switch]$IncludeSitePages,

    [Parameter(Mandatory = $false)]
    [switch]$IncludeSampleItems,

    [Parameter(Mandatory = $false)]
    [int]$SampleItemLimit = 10
)

$ErrorActionPreference = "Stop"

if (-not $OutputFolder) {
    $repoRoot = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { (Get-Location).Path }
    $OutputFolder = Join-Path $repoRoot "refdocs"
}

$knownListIds = @{
    "Master Calendar"      = "ba41b5e9-74a9-4b73-92b6-e52850322b2f"
    "Master Calendar Sync" = "284250a1-f980-419d-9d77-373c14b37f7d"
}

function ConvertTo-SafeFileName {
    param([Parameter(Mandatory = $true)][string]$Value)
    return ($Value -replace '[\\/:*?"<>|]', '_')
}

function Get-FieldChoices {
    param([Parameter(Mandatory = $true)][object]$Field)

    if ($Field.TypeAsString -notin @("Choice", "MultiChoice")) {
        return @()
    }

    try {
        return @($Field.Choices)
    } catch {
        return @()
    }
}

function Get-ListByTitleOrKnownId {
    param([Parameter(Mandatory = $true)][string]$ListName)

    try {
        return Get-PnPList -Identity $ListName -Includes `
            RootFolder, ContentTypes, HasUniqueRoleAssignments, IrmEnabled, NoCrawl, `
            EnableFolderCreation, EnableAttachments, ValidationFormula, ValidationMessage, `
            ReadSecurity, WriteSecurity, MajorVersionLimit, MajorWithMinorVersionsLimit, `
            DefaultContentApprovalWorkflowId, SchemaXml -ErrorAction Stop
    } catch {
        if ($knownListIds.ContainsKey($ListName)) {
            return Get-PnPList -Identity $knownListIds[$ListName] -Includes `
                RootFolder, ContentTypes, HasUniqueRoleAssignments, IrmEnabled, NoCrawl, `
                EnableFolderCreation, EnableAttachments, ValidationFormula, ValidationMessage, `
                ReadSecurity, WriteSecurity, MajorVersionLimit, MajorWithMinorVersionsLimit, `
                DefaultContentApprovalWorkflowId, SchemaXml -ErrorAction Stop
        }

        throw
    }
}

Write-Host "=== Export-MasterCalendarSolution.ps1 started ===" -ForegroundColor Cyan
Write-Host "SiteUrl           : $SiteUrl"
Write-Host "ListNames         : $($ListNames -join ', ')"
Write-Host "OutputFolder      : $OutputFolder"
Write-Host "IncludeSitePages  : $($IncludeSitePages.IsPresent)"
Write-Host "IncludeSampleItems: $($IncludeSampleItems.IsPresent)"
Write-Host ""

Write-Host "[1/5] Checking PnP.PowerShell module..." -ForegroundColor Yellow
$pnpModule = Get-Module -Name PnP.PowerShell -ListAvailable | Sort-Object Version -Descending | Select-Object -First 1
if (-not $pnpModule) {
    Write-Host "ERROR: PnP.PowerShell not found. Run: Install-Module PnP.PowerShell -Scope CurrentUser" -ForegroundColor Red
    exit 1
}
Write-Host "  Found PnP.PowerShell v$($pnpModule.Version)" -ForegroundColor Green

Write-Host ""
Write-Host "[2/5] Connecting to SharePoint..." -ForegroundColor Yellow
Write-Host "  A browser window may open. Complete sign-in to continue."
try {
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    Write-Host "  Connected successfully." -ForegroundColor Green
} catch {
    Write-Host "ERROR connecting: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[3/5] Preparing output folder..." -ForegroundColor Yellow
if (-not (Test-Path $OutputFolder)) {
    New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
}
Write-Host "  Ready: $OutputFolder" -ForegroundColor Green

$exportedFiles = @()
$summaryLists = @()

Write-Host ""
Write-Host "[4/5] Exporting target lists..." -ForegroundColor Yellow

foreach ($listName in $ListNames) {
    Write-Host ""
    Write-Host "  >> $listName" -ForegroundColor Cyan

    try {
        $list = Get-ListByTitleOrKnownId -ListName $listName
    } catch {
        Write-Host "     ERROR: Could not resolve list '$listName': $($_.Exception.Message)" -ForegroundColor Red
        continue
    }

    $resolvedTitle = $list.Title
    $safeName = ConvertTo-SafeFileName -Value $resolvedTitle

    $contentTypes = @()
    try {
        $contentTypes = @($list.ContentTypes | ForEach-Object {
            [PSCustomObject]@{
                Name   = $_.Name
                Id     = $_.Id.StringValue
                Hidden = $_.Hidden
            }
        })
    } catch {
        $contentTypes = @()
    }

    $settings = [PSCustomObject]@{
        Title                        = $list.Title
        Id                           = $list.Id.ToString()
        ServerRelativeUrl            = $list.RootFolder.ServerRelativeUrl
        DefaultViewUrl               = $list.DefaultViewUrl
        BaseTemplate                 = $list.BaseTemplate
        BaseType                     = $list.BaseType.ToString()
        Description                  = $list.Description
        ItemCount                    = $list.ItemCount
        Hidden                       = $list.Hidden
        OnQuickLaunch                = $list.OnQuickLaunch
        EnableVersioning             = $list.EnableVersioning
        EnableMinorVersions          = $list.EnableMinorVersions
        EnableModeration             = $list.EnableModeration
        ForceCheckout                = $list.ForceCheckout
        MajorVersionLimit            = $list.MajorVersionLimit
        MajorWithMinorVersionsLimit  = $list.MajorWithMinorVersionsLimit
        ContentTypesEnabled          = $list.ContentTypesEnabled
        EnableAttachments            = $list.EnableAttachments
        EnableFolderCreation         = $list.EnableFolderCreation
        HasUniqueRoleAssignments     = $list.HasUniqueRoleAssignments
        ReadSecurity                 = $list.ReadSecurity
        WriteSecurity                = $list.WriteSecurity
        IrmEnabled                   = $list.IrmEnabled
        NoCrawl                      = $list.NoCrawl
        ValidationFormula            = $list.ValidationFormula
        ValidationMessage            = $list.ValidationMessage
        DefaultContentApprovalWorkflowId = if ($list.DefaultContentApprovalWorkflowId) { $list.DefaultContentApprovalWorkflowId.ToString() } else { $null }
        ContentTypes                 = $contentTypes
    }

    Write-Host "     Reading views..." -ForegroundColor Gray
    try {
        $views = @(Get-PnPView -List $resolvedTitle -ErrorAction Stop | Sort-Object Title | ForEach-Object {
            [PSCustomObject]@{
                Title                 = $_.Title
                Id                    = $_.Id.ToString()
                ServerRelativeUrl     = $_.ServerRelativeUrl
                DefaultView           = $_.DefaultView
                Hidden                = $_.Hidden
                PersonalView          = $_.PersonalView
                ViewType              = $_.ViewType.ToString()
                Paged                 = $_.Paged
                RowLimit              = $_.RowLimit
                TabularView           = $_.TabularView
                ViewFields            = @($_.ViewFields)
                ViewQuery             = $_.ViewQuery
                ViewJoins             = $_.ViewJoins
                ViewProjectedFields   = $_.ViewProjectedFields
            }
        })
    } catch {
        Write-Host "     WARNING: Could not read views: $($_.Exception.Message)" -ForegroundColor Yellow
        $views = @()
    }

    Write-Host "     Reading fields..." -ForegroundColor Gray
    try {
        $fields = @(Get-PnPField -List $resolvedTitle -ErrorAction Stop | Sort-Object Title | ForEach-Object {
            [PSCustomObject]@{
                Title                 = $_.Title
                InternalName          = $_.InternalName
                StaticName            = $_.StaticName
                Id                    = $_.Id.ToString()
                TypeAsString          = $_.TypeAsString
                Required              = $_.Required
                Hidden                = $_.Hidden
                ReadOnlyField         = $_.ReadOnlyField
                EnforceUniqueValues   = $_.EnforceUniqueValues
                Indexed               = $_.Indexed
                Group                 = $_.Group
                DefaultValue          = $_.DefaultValue
                Description           = $_.Description
                Choices               = @(Get-FieldChoices -Field $_)
                LookupList            = $_.LookupList
                LookupField           = $_.LookupField
                CustomFormatter       = $_.CustomFormatter
                JSLink                = $_.JSLink
                SchemaXml             = $_.SchemaXml
            }
        })
    } catch {
        Write-Host "     WARNING: Could not read fields: $($_.Exception.Message)" -ForegroundColor Yellow
        $fields = @()
    }

    $sampleItems = @()
    if ($IncludeSampleItems.IsPresent) {
        Write-Host "     Reading sample items..." -ForegroundColor Gray
        try {
            $sampleItems = @(Get-PnPListItem -List $resolvedTitle -PageSize $SampleItemLimit -Fields "ID", "Title", "Created", "Modified" -ErrorAction Stop |
                Select-Object -First $SampleItemLimit |
                ForEach-Object {
                    [PSCustomObject]@{
                        Id       = $_["ID"]
                        Title    = $_["Title"]
                        Created  = $_["Created"]
                        Modified = $_["Modified"]
                    }
                })
        } catch {
            Write-Host "     WARNING: Could not read sample items: $($_.Exception.Message)" -ForegroundColor Yellow
            $sampleItems = @()
        }
    }

    $listOutput = [PSCustomObject]@{
        ExportedAt  = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        SiteUrl     = $SiteUrl
        Settings    = $settings
        Views       = $views
        Fields      = $fields
        SampleItems = $sampleItems
    }

    $jsonPath = Join-Path $OutputFolder "$safeName-ListSettings.json"
    $listOutput | ConvertTo-Json -Depth 12 | Out-File -FilePath $jsonPath -Encoding utf8
    $exportedFiles += $jsonPath
    Write-Host "     [OK] $jsonPath" -ForegroundColor Green

    if ($list.SchemaXml) {
        $schemaPath = Join-Path $OutputFolder "$safeName-Schema.xml"
        $list.SchemaXml | Out-File -FilePath $schemaPath -Encoding utf8
        $exportedFiles += $schemaPath
        Write-Host "     [OK] $schemaPath" -ForegroundColor Green
    }

    $summaryLists += [PSCustomObject]@{
        Title             = $list.Title
        Id                = $list.Id.ToString()
        BaseTemplate      = $list.BaseTemplate
        BaseType          = $list.BaseType.ToString()
        ItemCount         = $list.ItemCount
        FieldCount        = $fields.Count
        ViewCount         = $views.Count
        ServerRelativeUrl = $list.RootFolder.ServerRelativeUrl
        OutputFile        = $jsonPath
    }
}

$sitePages = @()
if ($IncludeSitePages.IsPresent) {
    Write-Host ""
    Write-Host "  >> Site Pages inventory" -ForegroundColor Cyan
    try {
        $sitePages = @(Get-PnPListItem -List "Site Pages" -PageSize 100 -Fields "ID", "Title", "FileLeafRef", "FileRef", "Modified", "Editor" -ErrorAction Stop |
            ForEach-Object {
                [PSCustomObject]@{
                    Id                = $_["ID"]
                    Title             = $_["Title"]
                    FileName          = $_["FileLeafRef"]
                    ServerRelativeUrl = $_["FileRef"]
                    Modified          = $_["Modified"]
                    Editor            = if ($_["Editor"]) { $_["Editor"].LookupValue } else { $null }
                }
            })
    } catch {
        Write-Host "     WARNING: Could not export Site Pages inventory: $($_.Exception.Message)" -ForegroundColor Yellow
        $sitePages = @()
    }
}

Write-Host ""
Write-Host "[5/5] Writing solution summary..." -ForegroundColor Yellow
$web = Get-PnPWeb -Includes Title, Url, Description, LogoUrl, WebTemplate -ErrorAction SilentlyContinue
$summaryPath = Join-Path $OutputFolder "MasterCalendar-SolutionInventory.json"
[PSCustomObject]@{
    ExportedAt = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    Site       = [PSCustomObject]@{
        Title       = $web.Title
        Url         = $web.Url
        Description = $web.Description
        LogoUrl     = $web.LogoUrl
        WebTemplate = $web.WebTemplate
    }
    Lists      = $summaryLists
    SitePages  = $sitePages
    Files      = $exportedFiles
} | ConvertTo-Json -Depth 10 | Out-File -FilePath $summaryPath -Encoding utf8
$exportedFiles += $summaryPath
Write-Host "  [OK] $summaryPath" -ForegroundColor Green

Write-Host ""
Write-Host "--- Export Summary ---" -ForegroundColor Cyan
$exportedFiles | ForEach-Object { Write-Host "  $_" }
Write-Host ""
Write-Host "=== Done! Exported Master Calendar inventory to: $OutputFolder ===" -ForegroundColor Cyan

Disconnect-PnPOnline -ErrorAction SilentlyContinue
