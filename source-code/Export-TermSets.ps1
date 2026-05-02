# Requires: PnP.PowerShell version 1.5.0
# Install example:
# Install-Module PnP.PowerShell -RequiredVersion 1.5.0

param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,
    
    [Parameter(Mandatory = $false)]
    [string]$TermSetName,
    
    [Parameter(Mandatory = $false)]
    [string]$TermGroupName = "Site Collection"
)

try {
    Write-Host "Connecting to site: $SiteUrl" -ForegroundColor Cyan
    Connect-PnPOnline -Url $SiteUrl -UseWebLogin

    # 1. Get all term groups
    Write-Host "`nRetrieving all Term Groups..." -ForegroundColor Green
    $termGroups = Get-PnPTermGroup
    $termGroups | ForEach-Object {
        Write-Host "  - $($_.Name) (ID: $($_.Id))" -ForegroundColor Yellow
    }

    # 2. Get specific term group
    Write-Host "`nGetting Term Group: $TermGroupName" -ForegroundColor Green
    $termGroup = Get-PnPTermGroup -Identity $TermGroupName
    
    if (-not $termGroup) {
        throw "Term Group '$TermGroupName' not found."
    }

    # 3. Get all term sets in the group
    Write-Host "`nRetrieving Term Sets in '$TermGroupName'..." -ForegroundColor Green
    $termSets = Get-PnPTermSet -TermGroup $termGroup
    $termSets | ForEach-Object {
        Write-Host "  - $($_.Name) (ID: $($_.Id))" -ForegroundColor Yellow
    }

    # 4. Get specific term set (if name provided)
    if ($TermSetName) {
        Write-Host "`nGetting Term Set: $TermSetName" -ForegroundColor Green
        $termSet = Get-PnPTermSet -TermGroup $termGroup -Identity $TermSetName
        
        if (-not $termSet) {
            throw "Term Set '$TermSetName' not found in group '$TermGroupName'."
        }

        # 5. Get all terms in the term set
        Write-Host "`nTerms in '$TermSetName':" -ForegroundColor Green
        $terms = Get-PnPTerm -TermSet $termSet -TermGroup $termGroup -Recursive
        $terms | ForEach-Object {
            Write-Host "  - $($_.Name) (ID: $($_.Id))" -ForegroundColor Yellow
        }

        # 6. Export term set structure to JSON
        Write-Host "`nExporting term set structure..." -ForegroundColor Cyan
             # Sanitize the term set name for use in filename
        $safeTermSetName = ($TermSetName -replace '[\\/:*?"<>|]', '_')

        $termSetStructure = [PSCustomObject]@{
            TermSetName  = $termSet.Name
            TermSetId    = $termSet.Id
            Description  = $termSet.Description
            TermGroupName = $termGroup.Name
            TermGroupId  = $termGroup.Id
            TermCount    = @($terms).Count
            Terms        = @($terms | ForEach-Object {
                [PSCustomObject]@{
                    Name        = $_.Name
                    Id          = $_.Id
                    Description = $_.Description
                    IsAvailableForTagging = $_.IsAvailableForTagging
                }
            })
        }

        $outputPath = Join-Path $PSScriptRoot "$($safeTermSetName)-TermSet.json"
        $termSetStructure | ConvertTo-Json -Depth 5 | Out-File -FilePath $outputPath -Encoding utf8
        Write-Host "  Exported to: $outputPath" -ForegroundColor Green
    }

    Write-Host "`nSuccess!" -ForegroundColor Green

} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Disconnect-PnPOnline
}