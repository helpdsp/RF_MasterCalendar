#$lists = @("IT Helpdesk Holidays", "IT Helpdesk Locations", "IT Helpdesk Routing", "IT Helpdesk Settings", "IT Ticket Intake Queue")
$lists = @("Praise","Praise(Archive)","Praise Cards")
$siteUrl = "https://ruizfoods.sharepoint.com/sites/RuizNetPortal"
$outputFolder = "C:\DATA\Repos\rf_praise\refdocs"

foreach ($list in $lists) {
    & "C:\DATA\Repos\rf_praise\source-code\Export-ListSchema.ps1" `
      -SiteUrl $siteUrl `
      -ListTitle $list `
      -OutputFolder $outputFolder
}