<#
.SYNOPSIS
    Provision-PlantList.ps1 - Provisions a new Plant Spoke for the SWUK Prepayment solution.
    Compatible with PnP PowerShell version 1.5.0.

.DESCRIPTION
    1. Creates a SharePoint Security Group for the Plant.
    2. Provisions a new SharePoint List for Prepayment Requests.
    3. Configures all Site Columns and Internal Names to match POC requirements.
    4. Registers the new plant in the 'Facilities Master List'.

.EXAMPLE
    .\Provision-PlantList.ps1 -PlantCode "MAR" -PlantName "Margate" -AdminEmail "finance.admin@smurfitwestrock.com"
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$PlantCode,

    [Parameter(Mandatory=$true)]
    [string]$PlantName,

    [Parameter(Mandatory=$false)]
    [string]$SiteUrl = "https://smurfitkappa.sharepoint.com/sites/GBR-UK-Shared-Services",

    [Parameter(Mandatory=$false)]
    [string]$FacilitiesListName = "Facilities Master List",

    [Parameter(Mandatory=$false)]
    [string]$ContentTypeId = "0x0100F7C0524FF1642744B2C4644A8C17544B0079CFFCFFAAE8FD4DB83E90611E379BC4"
)

# 1. Connect to SharePoint
Write-Host "Connecting to $SiteUrl..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -UseWebLogin
# 2. Create Security Group
$GroupName = "[$PlantCode] Members"
Write-Host "Creating Security Group: $GroupName..." -ForegroundColor Cyan
$group = New-PnPGroup -Title $GroupName -Description "Members group for $PlantName prepayment submissions."
$groupId = $group.Id
Write-Host "Group Created with ID: $groupId" -ForegroundColor Green

# 3. Create Plant List
$ListName = "$PlantCode - Prepayment Request"
Write-Host "Creating List: $ListName..." -ForegroundColor Cyan
$list = New-PnPList -Title $ListName -Template GenericList -OnQuickLaunch

# 4. Enable and Add Content Type
Write-Host "Configuring Content Types..." -ForegroundColor Cyan
Set-PnPList -Identity $list -ContentTypesEnabled $true

Add-PnPContentTypeToList -List $list -ContentType $ContentTypeId -DefaultContentType

# Remove default "Item" Content Type to keep the list clean
Write-Host "Removing default 'Item' Content Type..." -ForegroundColor Cyan
Remove-PnPContentTypeFromList -List $list -ContentType "Item"

# 5. Add Calculated Columns (List Level - Not in Content Type)
Write-Host "Creating Calculated Columns at list level..." -ForegroundColor Cyan
$calcFormula = "=IF(ISBLANK([Title]),`"No`",`"Yes`")"
Add-PnPField -List $list -DisplayName "Processed" -InternalName "isEmpty" -Type Calculated -Formula $calcFormula -AddToDefaultView
Add-PnPField -List $list -DisplayName "Processed On" -InternalName "Processed_x0020_On" -Type DateTime
Add-PnPField -List $list -DisplayName "Plant" -InternalName "Plant" -Type Text
Set-PnPField -List $list -Identity "Plant" -Values @{DefaultValue=$PlantCode}

# 6. Create Views (Pending and Processed)
Write-Host "Replicating Views..." -ForegroundColor Cyan

# Pending View (Default)
$pendingQuery = "<Where><Eq><FieldRef Name='isEmpty' /><Value Type='Text'>No</Value></Eq></Where>"
Add-PnPView -List $list -Title "Pending" -Query $pendingQuery -Fields "Title","Bus_x0020_Area","Invoice_x0020_Number","Invoice_x0020_Value","PO" -SetAsDefault

# Processed View
$processedQuery = "<Where><Eq><FieldRef Name='isEmpty' /><Value Type='Text'>Yes</Value></Eq></Where>"
Add-PnPView -List $list -Title "Processed" -Query $processedQuery -Fields "Title","Bus_x0020_Area","Invoice_x0020_Number","Invoice_x0020_Value","PO","Processed_x0020_On"

# 6. Configure Security (List Level)
Write-Host "Breaking list inheritance and assigning permissions..." -ForegroundColor Cyan
Set-PnPList -Identity $list -BreakRoleInheritance -CopyRoleAssignments $false
Add-PnPGroupToList -List $list -Identity $group -Role "Contribute"
Add-PnPGroupToList -List $list -Identity "Owners" -Role "Full Control"

# 7. Register in Facilities Master List
Write-Host "Registering Plant in $FacilitiesListName..." -ForegroundColor Cyan
Add-PnPListItem -List $FacilitiesListName -Values @{
    "Title" = $PlantCode;
    "Plant" = $PlantName;
    "PaymentRequestList" = $ListName;
    "MembershipGroupId" = $groupId;
}

Write-Host "Provisioning complete for $PlantName ($PlantCode)." -ForegroundColor Green
