<#
.SYNOPSIS
    UnProvision-PlantList.ps1 - Removes a Plant Spoke from the SWUK Prepayment solution.

.DESCRIPTION
    This script reverses the actions performed by Provision-PlantList.ps1.

    IMPORTANT:
    This code runs under Smurfit Westrock Corporate Environment and is designed to support
    corporate workstation constraints such as redirected Documents folders, restricted module
    installation paths, and the use of PnP.PowerShell 1.5.0 from a controlled local module folder.

    Actions performed (in reverse-provision order):
    1. Imports PnP.PowerShell 1.5.0 from the corporate-safe module path when available.
    2. Connects to the target SharePoint Online site.
    3. Prompts for confirmation before any destructive action.
    4. Removes the plant entry from the Facilities Master List.
    5. Deletes the plant-specific Prepayment Request list (sent to recycle bin).
    6. Deletes the plant-specific SharePoint Security Group.

.EXAMPLE
    .\UnProvision-PlantList.ps1 -PlantCode "MAR" -PlantName "Margate"

.NOTES
    Compatible with PnP.PowerShell 1.5.0.
    Recommended corporate import path:
    C:\PowerShellModules\PnP.PowerShell\1.5.0\PnP.PowerShell.psd1
#>

[CmdletBinding(SupportsShouldProcess)]
param (
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$PlantCode,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$SiteUrl = "https://smurfitkappa.sharepoint.com/sites/GBR-UK-Shared-Services",

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$FacilitiesListName = "Facilities Master List",

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$PnPModulePath = "C:\PowerShellModules\PnP.PowerShell\1.5.0\PnP.PowerShell.psd1",

    [Parameter(Mandatory = $false)]
    [switch]$Force
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "`n$Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Green
}

function Write-WarningMessage {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Yellow
}

function Ensure-PnPModule {
    param([string]$ModulePath)

    Write-Step "Checking PnP.PowerShell module..."

    $loadedModule = Get-Module -Name PnP.PowerShell -ErrorAction SilentlyContinue
    if ($loadedModule -and $loadedModule.Version.ToString() -eq "1.5.0") {
        Write-Success "PnP.PowerShell 1.5.0 is already loaded."
        return
    }

    if (Test-Path $ModulePath) {
        Import-Module $ModulePath -Force
    }
    else {
        Import-Module PnP.PowerShell -RequiredVersion 1.5.0 -Force
    }

    $module = Get-Module -Name PnP.PowerShell -ErrorAction Stop
    if ($module.Version.ToString() -ne "1.5.0") {
        throw "PnP.PowerShell version 1.5.0 is required. Loaded version: $($module.Version)."
    }

    Write-Success "Loaded PnP.PowerShell $($module.Version) from $($module.ModuleBase)."
}

function Confirm-Action {
    param([string]$Message)

    if ($Force) { return $true }

    $response = Read-Host "$Message`n  Type YES to confirm"
    return $response -eq "YES"
}

function Remove-FacilitiesEntry {
    param(
        [string]$FacilitiesListName,
        [string]$PlantCode
    )

    $facilitiesList = Get-PnPList -Identity $FacilitiesListName -ErrorAction SilentlyContinue
    if (-not $facilitiesList) {
        Write-WarningMessage "Facilities list '$FacilitiesListName' not found. Skipping entry removal."
        return
    }

    $safePlantCode = $PlantCode.Replace("'", "''")
    $query = "<View><Query><Where><Eq><FieldRef Name='Title' /><Value Type='Text'>$safePlantCode</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    $existingItem = Get-PnPListItem -List $FacilitiesListName -Query $query -ErrorAction Stop

    if (-not $existingItem -or $existingItem.Count -eq 0) {
        Write-WarningMessage "No entry found for '$PlantCode' in '$FacilitiesListName'. Skipping."
        return
    }

    Remove-PnPListItem -List $FacilitiesListName -Identity $existingItem[0].Id -Force
    Write-Success "Removed '$PlantCode' entry from '$FacilitiesListName'."
}

function Remove-PlantList {
    param([string]$ListName)

    $list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if (-not $list) {
        Write-WarningMessage "List '$ListName' not found. Skipping deletion."
        return
    }

    Remove-PnPList -Identity $ListName -Force
    Write-Success "List '$ListName' sent to recycle bin."
}

function Remove-PlantGroup {
    param([string]$GroupName)

    $group = Get-PnPGroup -Identity $GroupName -ErrorAction SilentlyContinue
    if (-not $group) {
        Write-WarningMessage "Group '$GroupName' not found. Skipping deletion."
        return
    }

    Remove-PnPGroup -Identity $GroupName -Force
    Write-Success "Group '$GroupName' deleted."
}

try {
    $PlantCode = $PlantCode.Trim().ToUpper()

    $ListName  = "$PlantCode - Prepayment Request"
    $GroupName = "$PlantCode Members"

    Ensure-PnPModule -ModulePath $PnPModulePath

    Write-Step "Connecting to $SiteUrl..."
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    Write-Success "Connected to SharePoint site."

    Write-Host "`nThe following items will be permanently removed:" -ForegroundColor Red
    Write-Host "  - Facilities Master List entry : $PlantCode" -ForegroundColor Red
    Write-Host "  - SharePoint List              : $ListName (sent to recycle bin)" -ForegroundColor Red
    Write-Host "  - SharePoint Security Group    : $GroupName" -ForegroundColor Red

    if (-not (Confirm-Action -Message "`nAre you sure you want to unprovision plant '$PlantCode'?")) {
        Write-Host "`nUnprovisioning cancelled." -ForegroundColor Yellow
        exit 0
    }

    Write-Step "Removing Facilities Master List entry..."
    Remove-FacilitiesEntry -FacilitiesListName $FacilitiesListName -PlantCode $PlantCode

    Write-Step "Removing Prepayment Request list..."
    Remove-PlantList -ListName $ListName

    Write-Step "Removing SharePoint Security Group..."
    Remove-PlantGroup -GroupName $GroupName

    Write-Success "`nUnprovisioning complete for plant '$PlantCode'."
}
catch {
    Write-Host "`nUnprovisioning failed." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    throw
}
