#$lists = @("IT Helpdesk Holidays", "IT Helpdesk Locations", "IT Helpdesk Routing", "IT Helpdesk Settings", "IT Ticket Intake Queue")
$lists = @("Tickets")
$siteUrl = "https://cityofranchocordovaorg.sharepoint.com/sites/ITHelpdesk"
$outputFolder = "C:\DATA\Repos\rc_itissuetrackingplatform\refdocs"

foreach ($list in $lists) {
    & "C:\DATA\Repos\rc_itissuetrackingplatform\source-code\Export-ListSchema.ps1" `
      -SiteUrl $siteUrl `
      -ListTitle $list `
      -OutputFolder $outputFolder
}