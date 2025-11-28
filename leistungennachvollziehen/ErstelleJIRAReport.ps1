param(
    [string]$XmlFile   = "C:\Projekte\jira_activity.xml",
    [int]$Days         = 30,
    [string]$OutputTxt = "$HOME\jira_leistungsnachweis.txt"
)

if (-not (Test-Path $XmlFile)) {
    throw "XML-Datei nicht gefunden: $XmlFile"
}

$since = (Get-Date).AddDays(-$Days)

# XML laden
[xml]$feed = Get-Content $XmlFile -Raw

function Clean-Text {
    param([string]$text)

    if (-not $text) { return "" }

    $decoded = [System.Net.WebUtility]::HtmlDecode($text)
    $clean   = $decoded -replace "<[^>]+>", " "
    return ($clean -replace "\s+", " ").Trim()
}

# Datei neu anlegen
"Leistungsnachweis (Aktivitaetsstrom)" | Out-File -FilePath $OutputTxt -Encoding UTF8
"Zeitraum: letzte $Days Tage"          | Out-File -FilePath $OutputTxt -Append -Encoding UTF8
"=============================================================" | Out-File -FilePath $OutputTxt -Append -Encoding UTF8
"" | Out-File -FilePath $OutputTxt -Append -Encoding UTF8

# Atom-Feed (<feed><entry>...</entry></feed>)
if ($feed.feed.entry) {
    foreach ($entry in $feed.feed.entry) {

        $rawDate = $entry.updated
        if (-not $rawDate) { $rawDate = $entry.published }
        if (-not $rawDate) { continue }

        $date = Get-Date $rawDate
        if ($date -lt $since) { continue }

        $titleRaw   = $entry.title.'#text'
        if (-not $titleRaw) { $titleRaw = $entry.title.InnerXml }

        $summaryRaw = $entry.summary.'#text'
        if (-not $summaryRaw) { $summaryRaw = $entry.summary.InnerXml }

        $title   = Clean-Text $titleRaw
        $summary = Clean-Text $summaryRaw

        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ("Datum: {0:yyyy-MM-dd HH:mm}" -f $date)
        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ("Taetigkeit: $title")

        if ($summary) {
            Add-Content -Path $OutputTxt -Encoding UTF8 -Value ("Details: $summary")
        }

        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ""
        Add-Content -Path $OutputTxt -Encoding UTF8 -Value "------------------------------------------------------------"
        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ""
    }
}
# RSS-Fallback (<rss><channel><item>...</item></channel></rss>)
elseif ($feed.rss.channel.item) {
    foreach ($item in $feed.rss.channel.item) {

        $rawDate = $item.pubDate
        if (-not $rawDate) { continue }

        $date = Get-Date $rawDate
        if ($date -lt $since) { continue }

        $title   = Clean-Text $item.title
        $summary = Clean-Text $item.description

        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ("Datum: {0:yyyy-MM-dd HH:mm}" -f $date)
        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ("Taetigkeit: $title")

        if ($summary) {
            Add-Content -Path $OutputTxt -Encoding UTF8 -Value ("Details: $summary")
        }

        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ""
        Add-Content -Path $OutputTxt -Encoding UTF8 -Value "------------------------------------------------------------"
        Add-Content -Path $OutputTxt -Encoding UTF8 -Value ""
    }
}
else {
    Add-Content -Path $OutputTxt -Encoding UTF8 -Value "Keine verwertbaren Feed-Eintraege gefunden."
}

Write-Host "Leistungsnachweis erstellt: $OutputTxt"
