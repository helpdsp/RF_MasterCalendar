# Master Calendar list export shortcut.
#
# This wrapper keeps the historical "Export-AllLists.ps1" entry point, but now
# targets the RuizNetPortal Master Calendar solution by default.

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

$exportScript = Join-Path $PSScriptRoot "Export-MasterCalendarSolution.ps1"
if (-not (Test-Path $exportScript)) {
    throw "Missing required script: $exportScript"
}

$params = @{
    SiteUrl         = $SiteUrl
    ListNames       = $ListNames
    SampleItemLimit = $SampleItemLimit
}

if ($OutputFolder) { $params.OutputFolder = $OutputFolder }
if ($IncludeSitePages.IsPresent) { $params.IncludeSitePages = $true }
if ($IncludeSampleItems.IsPresent) { $params.IncludeSampleItems = $true }

& $exportScript @params
