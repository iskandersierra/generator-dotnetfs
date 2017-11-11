# Yeoman Generator for F# dotnet project

Yeoman Generator for F# dotnet project with xunit and build scripts

To create a dotnet solution use
```
md my-solution
cd my-solution
yo dotnetfs
```

The generator then asks the following questions:
```
? Solution name MySolution
? Initial commit message Initial commit
? Git remote repository https://github.com/myaccount/myremote.git
? Push to origin No
```

To add a new library (with xUnit testing library included) to the solution use the following command from the root of the solution folder:
```
yo dotnetfs:newlib
```

The generator then asks the following questions:
```
? Project name MyProject
? Folder name proj
? Commit changes No
```
