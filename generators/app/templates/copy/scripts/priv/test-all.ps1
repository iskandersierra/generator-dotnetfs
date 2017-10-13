$projsFiles = Get-ChildItem -Path .\test -Filter "*.??proj" -Recurse

ForEach ($projFile in $projsFiles)
{
  $fileName = $projFile.FullName
  dotnet test "$fileName" -c Release
}