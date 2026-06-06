param(
  [string]$AirlinesSource = "src/data/_openflights-airlines.dat",
  [string]$AirportsSource = "src/data/_ourairports-airports.csv",
  [string]$OutputDirectory = "src/data"
)

$ErrorActionPreference = "Stop"
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
$downloadedAirlines = $false
$downloadedAirports = $false

New-Item -ItemType Directory -Force $OutputDirectory | Out-Null

if (-not (Test-Path $AirlinesSource)) {
  Invoke-WebRequest `
    -Uri "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airlines.dat" `
    -OutFile $AirlinesSource
  $downloadedAirlines = $true
}

if (-not (Test-Path $AirportsSource)) {
  Invoke-WebRequest `
    -Uri "https://davidmegginson.github.io/ourairports-data/airports.csv" `
    -OutFile $AirportsSource
  $downloadedAirports = $true
}

$airlines = Import-Csv -Path $AirlinesSource -Header id, name, alias, iata, icao, callsign, country, active |
  Where-Object {
    $_.active -eq "Y" -and
    $_.iata -and $_.iata -ne "\N" -and
    $_.name -and $_.name -ne "\N"
  } |
  Group-Object iata |
  ForEach-Object { $_.Group | Select-Object -First 1 } |
  Sort-Object name |
  ForEach-Object {
    [ordered]@{
      name = $_.name
      iata = $_.iata
      icao = if ($_.icao -eq "\N") { "" } else { $_.icao }
      country = if ($_.country -eq "\N") { "" } else { $_.country }
    }
  }

$airports = Import-Csv -Path $AirportsSource |
  Where-Object {
    $_.scheduled_service -eq "yes" -and
    $_.iata_code
  } |
  Group-Object iata_code |
  ForEach-Object { $_.Group | Select-Object -First 1 } |
  Sort-Object iata_code |
  ForEach-Object {
    [ordered]@{
      name = $_.name
      iata = $_.iata_code
      icao = $_.ident
      municipality = $_.municipality
      country = $_.iso_country
    }
  }

[IO.File]::WriteAllText(
  (Join-Path $OutputDirectory "airlines.json"),
  ($airlines | ConvertTo-Json -Depth 3 -Compress),
  $utf8WithoutBom
)

[IO.File]::WriteAllText(
  (Join-Path $OutputDirectory "airports.json"),
  ($airports | ConvertTo-Json -Depth 3 -Compress),
  $utf8WithoutBom
)

Write-Host "Generated $($airlines.Count) airlines and $($airports.Count) airports."

if ($downloadedAirlines) {
  Remove-Item -LiteralPath $AirlinesSource
}

if ($downloadedAirports) {
  Remove-Item -LiteralPath $AirportsSource
}
