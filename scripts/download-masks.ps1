# Descarga máscaras pattern_N.webp y tmc_map para especies con GLB.
$ErrorActionPreference = "Continue"
$headers = @{
  Referer = "https://arkadiasurvival.com/skin/"
  "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
}
$base = "https://arkadiasurvival.com/dino-assets"
$outRoot = "C:\Users\mt_66\OneDrive\Desktop\islaprime\public\models\skins"

$species = @(
  @{ folder = "allo";       name = "Allosaurus";           count = 3 },
  @{ folder = "austro";     name = "Austroraptor";         count = 4 },
  @{ folder = "beipi";      name = "Beipiaosaurus";        count = 3 },
  @{ folder = "carno";      name = "Carnotaurus";          count = 4 },
  @{ folder = "cera";       name = "Ceratosaurus";         count = 3 },
  @{ folder = "deino";      name = "Deinosuchus";          count = 3 },
  @{ folder = "diablo";     name = "Diabloceratops";       count = 3 },
  @{ folder = "dilo";       name = "Dilophosaurus";        count = 3 },
  @{ folder = "dryo";       name = "Dryosaurus";           count = 3 },
  @{ folder = "galli";      name = "Gallimimus";           count = 3 },
  @{ folder = "herrera";    name = "Herrerasaurus";        count = 5 },
  @{ folder = "hypsi";      name = "Hypsilophodon";        count = 3 },
  @{ folder = "kentro";     name = "Kentrosaurus";         count = 3 },
  @{ folder = "maia";       name = "Maiasaura";            count = 3 },
  @{ folder = "omniraptor"; name = "Omniraptor";           count = 6 },
  @{ folder = "pachy";      name = "Pachycephalosaurus";   count = 5 },
  @{ folder = "ptera";      name = "Pteranodon";           count = 3 },
  @{ folder = "rex";        name = "Tyrannosaurus";        count = 5 },
  @{ folder = "stego";      name = "Stegosaurus";          count = 4 },
  @{ folder = "teno";       name = "Tenontosaurus";        count = 3 },
  @{ folder = "trice";      name = "Triceratops";          count = 6 },
  @{ folder = "troodon";    name = "Troodon";              count = 3 }
)

$tmcSummary = @()

foreach ($sp in $species) {
  $dir = Join-Path $outRoot $sp.folder
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  for ($i = 0; $i -lt $sp.count; $i++) {
    $out = Join-Path $dir "pattern_$i.webp"
    if ((Test-Path $out) -and ((Get-Item $out).Length -gt 1000)) {
      Write-Output "SKIP $($sp.folder)/pattern_$i.webp"
      continue
    }
    $url = "$base/$($sp.name)/pattern_$i.webp"
    try {
      Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -OutFile $out
      Write-Output "OK  $($sp.folder)/pattern_$i.webp"
    } catch {
      Write-Output "ERR $($sp.folder)/pattern_$i.webp"
    }
  }

  try {
    $tmc = Invoke-RestMethod -Uri "$base/$($sp.name)/tmc_map.json" -Headers $headers
    $tmc | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $dir "tmc_map.json")
    $entry = [ordered]@{
      folder = $sp.folder
      file = $tmc.file
      teeth = $tmc.teeth
      mouth = $tmc.mouth
      claws = $tmc.claws
    }
    $tmcSummary += $entry
    Write-Output "OK  $($sp.folder)/tmc_map.json file=$($tmc.file)"
    if ($tmc.file) {
      $utilOut = Join-Path $dir $tmc.file
      if (-not ((Test-Path $utilOut) -and ((Get-Item $utilOut).Length -gt 1000))) {
        try {
          Invoke-WebRequest -Uri "$base/$($sp.name)/$($tmc.file)" -Headers $headers -UseBasicParsing -OutFile $utilOut
          Write-Output "OK  $($sp.folder)/$($tmc.file)"
        } catch {
          Write-Output "ERR $($sp.folder)/$($tmc.file)"
        }
      } else {
        Write-Output "SKIP $($sp.folder)/$($tmc.file)"
      }
    }
  } catch {
    Write-Output "SIN tmc_map: $($sp.folder)"
  }
}

$tmcSummary | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $outRoot "_tmc_summary.json")
Write-Output "FIN"
