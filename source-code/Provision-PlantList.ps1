<#
.SYNOPSIS
    Provision-PlantList.ps1 - Provisions a new Plant Spoke for the SWUK Prepayment solution.

.DESCRIPTION
    This script provisions a plant-specific SharePoint list for Prepayment Requests.

    IMPORTANT:
    This code runs under Smurfit Westrock Corporate Environment and is designed to support
    corporate workstation constraints such as redirected Documents folders, restricted module
    installation paths, and the use of PnP.PowerShell 1.5.0 from a controlled local module folder.

    Main actions:
    1. Imports PnP.PowerShell 1.5.0 from the corporate-safe module path when available.
    2. Connects to the target SharePoint Online site.
    3. Creates or reuses a SharePoint Security Group for the Plant.
    4. Creates or reuses a plant-specific SharePoint List for Prepayment Requests.
    5. Enables Content Types and adds the required Prepayment content type.
    6. Creates required list-level columns if they do not already exist.
    7. Creates Pending and Processed views if they do not already exist.
    8. Breaks list permission inheritance and assigns plant/owner permissions.
    9. Registers the plant in the Facilities Master List when it does not already exist.

.EXAMPLE
    .\Provision-PlantList-Enhanced.ps1 -PlantCode "MAR" -PlantName "Margate"

.NOTES
    Compatible with PnP.PowerShell 1.5.0.
    Recommended corporate import path:
    C:\PowerShellModules\PnP.PowerShell\1.5.0\PnP.PowerShell.psd1
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$PlantCode,

    [Parameter(Mandatory = $true)]
    [ValidateNotNullOrEmpty()]
    [string]$PlantName,

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$SiteUrl = "https://smurfitkappa.sharepoint.com/sites/GBR-UK-Shared-Services",

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$FacilitiesListName = "Facilities Master List",

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$ContentTypeId = "0x0100F7C0524FF1642744B2C4644A8C17544B",

    [Parameter(Mandatory = $false)]
    [ValidateNotNullOrEmpty()]
    [string]$PnPModulePath = "C:\PowerShellModules\PnP.PowerShell\1.5.0\PnP.PowerShell.psd1"
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

function Ensure-SharePointGroup {
    param(
        [string]$GroupName,
        [string]$Description
    )

    $existingGroup = Get-PnPGroup -Identity $GroupName -ErrorAction SilentlyContinue
    if ($existingGroup) {
        Write-WarningMessage "SharePoint group already exists: $GroupName. Reusing existing group."
        return $existingGroup
    }

    return New-PnPGroup -Title $GroupName -Description $Description
}

function Ensure-List {
    param([string]$ListName)

    $existingList = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if ($existingList) {
        Write-WarningMessage "List already exists: $ListName. Reusing existing list."
        return $existingList
    }

    New-PnPList -Title $ListName -Template GenericList -OnQuickLaunch | Out-Null
    return Get-PnPList -Identity $ListName -ErrorAction Stop
}

function Ensure-Field {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [string]$Type,
        [string]$Formula = $null,
        [string]$ResultType = $null,
        [bool]$AddToDefaultView = $false
    )

    $field = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($field) {
        Write-WarningMessage "Field already exists: $DisplayName ($InternalName). Skipping creation."
        return
    }

    $params = @{
        List = $ListName
        DisplayName = $DisplayName
        InternalName = $InternalName
        Type = $Type
    }

    if ($Formula) { $params.Formula = $Formula }
    if ($ResultType) { $params.ResultType = $ResultType }
    if ($AddToDefaultView) { $params.AddToDefaultView = $true }

    Add-PnPField @params | Out-Null
    Write-Success "Created field: $DisplayName ($InternalName)."
}

function Ensure-View {
    param(
        [string]$ListName,
        [string]$ViewTitle,
        [string]$Query,
        [string[]]$Fields,
        [bool]$SetAsDefault = $false
    )

    $view = Get-PnPView -List $ListName -Identity $ViewTitle -ErrorAction SilentlyContinue
    if ($view) {
        Write-WarningMessage "View already exists: $ViewTitle. Skipping creation."
        return
    }

    $params = @{
        List = $ListName
        Title = $ViewTitle
        Query = $Query
        Fields = $Fields
    }

    if ($SetAsDefault) { $params.SetAsDefault = $true }

    Add-PnPView @params | Out-Null
    Write-Success "Created view: $ViewTitle."
}

function Ensure-ContentTypeOnList {
    param(
        [string]$ListName,
        [string]$ContentTypeId
    )

    $list = Get-PnPList -Identity $ListName -ErrorAction Stop
    $list.ContentTypesEnabled = $true
    $list.Update()
    Invoke-PnPQuery

    $listContentTypes = Get-PnPContentType -List $ListName -ErrorAction Stop
    $contentTypeExists = $listContentTypes | Where-Object { $_.StringId -eq $ContentTypeId -or $_.Id.StringValue -eq $ContentTypeId }

    if (-not $contentTypeExists) {
        Add-PnPContentTypeToList -List $ListName -ContentType $ContentTypeId -DefaultContentType | Out-Null
        Write-Success "Added content type to list: $ContentTypeId."
    }
    else {
        Write-WarningMessage "Content type already exists on list. Skipping add."
    }

    $itemContentType = Get-PnPContentType -List $ListName | Where-Object { $_.Name -eq "Item" }
    if ($itemContentType) {
        try {
            Remove-PnPContentTypeFromList -List $ListName -ContentType "Item" -Force
            Write-Success "Removed default Item content type."
        }
        catch {
            Write-WarningMessage "Could not remove Item content type. It may still be in use or locked. Details: $($_.Exception.Message)"
        }
    }
}

function Ensure-FacilitiesRegistration {
    param(
        [string]$FacilitiesListName,
        [string]$PlantCode,
        [string]$PlantName,
        [string]$PaymentRequestList,
        [int]$MembershipGroupId
    )

    $facilitiesList = Get-PnPList -Identity $FacilitiesListName -ErrorAction SilentlyContinue
    if (-not $facilitiesList) {
        throw "Facilities list '$FacilitiesListName' was not found. Please confirm the list exists before running this script."
    }

    $safePlantCode = $PlantCode.Replace("'", "''")
    $query = "<View><Query><Where><Eq><FieldRef Name='Title' /><Value Type='Text'>$safePlantCode</Value></Eq></Where></Query><RowLimit>1</RowLimit></View>"
    $existingItem = @(Get-PnPListItem -List $FacilitiesListName -Query $query -ErrorAction Stop)

    $values = @{
        "Title" = $PlantCode
        "Plant" = $PlantName
        "PaymentRequestList" = $PaymentRequestList
        "MembershipGroupId" = $MembershipGroupId
    }

    if ($existingItem.Count -gt 0) {
        Set-PnPListItem -List $FacilitiesListName -Identity $existingItem[0].Id -Values $values | Out-Null
        Write-WarningMessage "Plant already existed in Facilities Master List. Existing record was updated."
    }
    else {
        Add-PnPListItem -List $FacilitiesListName -Values $values | Out-Null
        Write-Success "Plant registered in Facilities Master List."
    }
}

try {
    $PlantCode = $PlantCode.Trim().ToUpper()
    $PlantName = $PlantName.Trim()

    Ensure-PnPModule -ModulePath $PnPModulePath

    Write-Step "Connecting to $SiteUrl..."
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin
    Write-Success "Connected to SharePoint site."

    Write-Step "Validating required site content type..."
    $siteContentType = Get-PnPContentType -Identity $ContentTypeId -ErrorAction SilentlyContinue
    if (-not $siteContentType) {
        Write-WarningMessage "Content type not found by ID '$ContentTypeId'. Searching by name pattern..."
        $siteContentType = Get-PnPContentType | Where-Object {
            $_.Name -like "*Prepayment*" -or $_.Name -like "*Payment*" -or $_.Name -like "*Request*"
        } | Select-Object -First 1
        if (-not $siteContentType) {
            throw "Required content type was not found at the site level: $ContentTypeId"
        }
        $ContentTypeId = $siteContentType.Id.StringValue
        Write-WarningMessage "Resolved content type by name: '$($siteContentType.Name)' (ID: $ContentTypeId)."
    }
    Write-Success "Required content type found: $($siteContentType.Name)."

    $GroupName = "$PlantCode Members"
    Write-Step "Creating or reusing SharePoint Security Group: $GroupName..."
    $group = Ensure-SharePointGroup -GroupName $GroupName -Description "Members group for $PlantName prepayment submissions."
    $groupId = [int]$group.Id
    Write-Success "Using group '$GroupName' with ID: $groupId."

    Set-PnPGroupPermissions -Identity $GroupName -AddRole "Read"
    Write-Success "Granted Read permission at site level to group: $GroupName."

    $ListName = "$PlantCode - Prepayment Request"
    Write-Step "Creating or reusing list: $ListName..."
    $list = Ensure-List -ListName $ListName
    Write-Success "Using list: $($list.Title)."

    Write-Step "Configuring content types..."
    Ensure-ContentTypeOnList -ListName $ListName -ContentTypeId $ContentTypeId

    Write-Step "Creating required list-level fields..."
    $calcFormula = '=IF(ISBLANK([Title]),"No","Yes")'
    Ensure-Field -ListName $ListName -DisplayName "Processed" -InternalName "isEmpty" -Type Calculated -Formula $calcFormula -ResultType Text -AddToDefaultView $true
    Ensure-Field -ListName $ListName -DisplayName "Processed On" -InternalName "Processed_x0020_On" -Type DateTime
    Ensure-Field -ListName $ListName -DisplayName "Plant" -InternalName "Plant" -Type Text

    Set-PnPField -List $ListName -Identity "Plant" -Values @{ DefaultValue = $PlantCode }
    Write-Success "Plant field default value set to: $PlantCode."

    Write-Step "Creating views..."
    $pendingQuery = "<Where><Eq><FieldRef Name='isEmpty' /><Value Type='Text'>No</Value></Eq></Where>"
    Ensure-View -ListName $ListName -ViewTitle "Pending" -Query $pendingQuery -Fields @("Title", "Bus_x0020_Area", "Invoice_x0020_Number", "Invoice_x0020_Value", "PO") -SetAsDefault $true

    $processedQuery = "<Where><Eq><FieldRef Name='isEmpty' /><Value Type='Text'>Yes</Value></Eq></Where>"
    Ensure-View -ListName $ListName -ViewTitle "Processed" -Query $processedQuery -Fields @("Title", "Bus_x0020_Area", "Invoice_x0020_Number", "Invoice_x0020_Value", "PO", "Processed_x0020_On")

    Write-Step "Breaking list inheritance and assigning permissions..."
    Set-PnPList -Identity $ListName -BreakRoleInheritance -CopyRoleAssignments:$false

    Set-PnPListPermission -Identity $ListName -Group $GroupName -AddRole "Contribute"

    $web = Get-PnPWeb -Includes AssociatedOwnerGroup
    if ($web.AssociatedOwnerGroup -and $web.AssociatedOwnerGroup.Title) {
        Set-PnPListPermission -Identity $ListName -Group $web.AssociatedOwnerGroup.Title -AddRole "Full Control"
        Write-Success "Assigned Full Control to site owners group: $($web.AssociatedOwnerGroup.Title)."
    }
    else {
        Write-WarningMessage "Could not identify the associated site owners group automatically. Please verify list permissions manually."
    }

    Write-Success "Assigned Contribute permissions to: $GroupName."

    Write-Step "Registering plant in $FacilitiesListName..."
    Ensure-FacilitiesRegistration `
        -FacilitiesListName $FacilitiesListName `
        -PlantCode $PlantCode `
        -PlantName $PlantName `
        -PaymentRequestList $ListName `
        -MembershipGroupId $groupId

    Write-Success "`nProvisioning complete for $PlantName ($PlantCode)."
}
catch {
    Write-Host "`nProvisioning failed." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    throw
}
