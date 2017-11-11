Param (
  $NugetSource = "https://www.nuget.org/api/v2/package",
  [switch]$WhatIf
)

# Get all *.[fs|cs|vb]proj file in src to push to nuget
$projsFiles = Get-ChildItem -Path .\src -Filter "*.??proj" -Recurse

ForEach ($projFile in $projsFiles)
{
  $projDir = $projFile.DirectoryName
  [xml]$projXml = Get-Content $projFile.FullName
  $packageId = Select-Xml -xml $projXml -XPath "/Project/PropertyGroup[1]/PackageId"
  $packageVersion = Select-Xml -xml $projXml -XPath "/Project/PropertyGroup[1]/PackageVersion"
  $nupkgFileName = Join-Path $projDir "bin\Release\$packageId.$packageVersion.nupkg"
  If (Test-Path $nupkgFileName)
  {
    $results = nuget list $packageId -Prerelease -Source $NugetSource
    $currentVersion = ""
    ForEach ($line in $results)
    {
      $lineSplit = $line.Split(" ")
      if ($lineSplit.Length -ne 2)
      {
        Continue
      }
      if ($lineSplit[0] -ne $packageId)
      {
        Continue
      }
      $currentVersion = $lineSplit[1]
    }

    if ($currentVersion -eq "")
    {
      Write-Host "Publishing $packageId@$packageVersion for the first time to $NugetSource ..." -ForegroundColor Green
    }
    elseif ($currentVersion -eq $packageVersion)
    {
      Write-Host "Package $packageId@$packageVersion is already published at $NugetSource" -ForegroundColor DarkYellow
      Continue
    }
    else
    {
      Write-Host "Publishing $packageId@$packageVersion over version $currentVersion to $NugetSource ..." -ForegroundColor Green
    }
    if (-not $WhatIf)
    {
      dotnet nuget push -s "$NugetSource" "$nupkgFileName"
      Write-Host "Success!" -ForegroundColor Green
    }
    else
    {
      Write-Host "Operation canceled by switch WhatIf" -ForegroundColor Yellow
    }
  }
}



