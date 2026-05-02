# Requires: PnP.PowerShell version 1.5.0
# Install example:
# Install-Module PnP.PowerShell -RequiredVersion 1.5.0

param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $true)]
    [string]$ListTitle,

    [Parameter(Mandatory = $true)]
    [string]$OutputFolder
)

try {
    Write-Host "Connecting to site: $SiteUrl" -ForegroundColor Cyan
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin

    Write-Host "Retrieving list: $ListTitle" -ForegroundColor Cyan
    $list = Get-PnPList -Identity $ListTitle -Includes RootFolder, Views, Fields, ContentTypes

    if (-not $list) {
        throw "List '$ListTitle' was not found."
    }

    if (-not (Test-Path $OutputFolder)) {
        Write-Host "Creating output folder: $OutputFolder" -ForegroundColor Yellow
        New-Item -ItemType Directory -Path $OutputFolder -Force | Out-Null
    }

    $safeListName = ($ListTitle -replace '[\\/:*?"<>|]', '_')

    # 1. Export full schema XML
    $schemaXmlPath = Join-Path $OutputFolder "$safeListName-Schema.xml"
    Write-Host "Exporting list schema XML..." -ForegroundColor Cyan
    $list.SchemaXml | Out-File -FilePath $schemaXmlPath -Encoding utf8

    # 2. Export basic list properties as JSON for quick reference
    $propertiesPath = Join-Path $OutputFolder "$safeListName-Properties.json"
    Write-Host "Exporting list properties..." -ForegroundColor Cyan

    $listProperties = [PSCustomObject]@{
        Title                 = $list.Title
        Id                    = $list.Id
        BaseTemplate          = $list.BaseTemplate
        BaseType              = $list.BaseType
        Hidden                = $list.Hidden
        EnableVersioning      = $list.EnableVersioning
        EnableMinorVersions   = $list.EnableMinorVersions
        EnableModeration      = $list.EnableModeration
        ForceCheckout         = $list.ForceCheckout
        ItemCount             = $list.ItemCount
        DefaultViewUrl        = $list.DefaultViewUrl
        RootFolderServerUrl   = $list.RootFolder.ServerRelativeUrl
        Description           = $list.Description
        ContentTypesEnabled   = $list.ContentTypesEnabled
        OnQuickLaunch         = $list.OnQuickLaunch
    }

    $listProperties | ConvertTo-Json -Depth 5 | Out-File -FilePath $propertiesPath -Encoding utf8

    # 3. Export fields summary
    $fieldsPath = Join-Path $OutputFolder "$safeListName-Fields.json"
    Write-Host "Exporting fields..." -ForegroundColor Cyan

    $fields = Get-PnPField -List $ListTitle | Sort-Object Title | ForEach-Object {
        [PSCustomObject]@{
            Title           = $_.Title
            InternalName    = $_.InternalName
            TypeAsString    = $_.TypeAsString
            Required        = $_.Required
            Hidden          = $_.Hidden
            ReadOnlyField   = $_.ReadOnlyField
            Group           = $_.Group
            Id              = $_.Id
        }
    }

    $fields | ConvertTo-Json -Depth 5 | Out-File -FilePath $fieldsPath -Encoding utf8

    # 4. Export views summary
    $viewsPath = Join-Path $OutputFolder "$safeListName-Views.json"
    Write-Host "Exporting views..." -ForegroundColor Cyan

    $views = Get-PnPView -List $ListTitle | Sort-Object Title | ForEach-Object {
        [PSCustomObject]@{
            Title         = $_.Title
            Id            = $_.Id
            ServerRelativeUrl = $_.ServerRelativeUrl
            DefaultView   = $_.DefaultView
            Hidden        = $_.Hidden
            ViewQuery     = $_.ViewQuery
            RowLimit      = $_.RowLimit
        }
    }

    $views | ConvertTo-Json -Depth 5 | Out-File -FilePath $viewsPath -Encoding utf8

    Write-Host ""
    Write-Host "Export completed successfully." -ForegroundColor Green
    Write-Host "Schema XML: $schemaXmlPath" -ForegroundColor Green
    Write-Host "Properties : $propertiesPath" -ForegroundColor Green
    Write-Host "Fields     : $fieldsPath" -ForegroundColor Green
    Write-Host "Views      : $viewsPath" -ForegroundColor Green
}
catch {
    Write-Error $_.Exception.Message
}