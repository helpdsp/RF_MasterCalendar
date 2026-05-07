#$lists = @("IT Helpdesk Holidays", "IT Helpdesk Locations", "IT Helpdesk Routing", "IT Helpdesk Settings", "IT Ticket Intake Queue")
$lists = @("Accounts Payable","Fixed Assets","FY2023","FY2024")
$siteUrl = "https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam"
$outputFolder = "C:\DATA\Repos\rf_taxteam\refdocs"

foreach ($list in $lists) {
    & "C:\DATA\Repos\rf_taxteam\source-code\Export-ListSchema.ps1" `
      -SiteUrl $siteUrl `
      -ListTitle $list `
      -OutputFolder $outputFolder
}


.\source-code\Export-SiteColumns.ps1 -SiteUrl "https://ruizfoods.sharepoint.com/sites/InvoiceforTaxTeam" -OutputFolder "C:\DATA\Repos\rf_taxteam\refdocs" -ColumnGroup "Custom Columns"
