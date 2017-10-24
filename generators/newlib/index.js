var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
  }

  prompting() {
    return this
      .prompt([{
        name: "projname",
        type: "input",
        message: "Project name",
        validate: (v) => {
            if (v && v.match("[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*")){
              return true;
            } else {
              return "Project name must be of the form <Name>(.<Name>)*"
            }
          }
        }, {
          name: "folder",
          type: "input",
          message: "Folder name",
          default: "<same as project name>",
        }, {
          name: "commitchanges",
          type: "confirm",
          message: "Commit changes",
          default: false,
        }])
      .then(answers => {
        this.projname = answers.projname;
        this.folder = answers.folder;
        this.commitchanges = answers.commitchanges;
        if (!this.folder || this.folder === "<same as project name>") {
          this.folder = this.projname;
        }
      });
  }

  configuring() {
    this.slnname = this.config.get("slnname");
  }

  default() {
  }

  writing() {
  }

  install() {
    var solution =
      this.destinationPath(`${this.slnname}.sln`);

    var sourceProject =
      this.destinationPath(
        "src", this.folder, 
        `${this.projname}.fsproj`);

    var testProject =
      this.destinationPath(
        "test", this.folder, 
        `${this.projname}.Tests.fsproj`);

    this.spawnCommandSync("dotnet", 
      [ "new", "classlib"
      , "-lang", "F#"
      , "-o", this.destinationPath("src", this.folder)
      , "--name", this.projname
      ]);

    this.spawnCommandSync("dotnet", 
      [ "new", "xunit"
      , "-lang", "F#" 
      , "-o", this.destinationPath("test", this.folder)
      , "--name", `${this.projname}.Tests`
      ]);

    this.spawnCommandSync("dotnet", 
      [ "sln", solution
      , "add", sourceProject
      ]);

    this.spawnCommandSync("dotnet", 
      [ "sln", solution
      , "add", testProject
      ]);

    this.spawnCommandSync("dotnet", 
      [ "add", testProject
      , "reference", sourceProject
      ]);

    this.spawnCommandSync("dotnet", 
      [ "add", testProject
      , "package", "FsUnit.xUnit"
      ]);

    this.spawnCommandSync("dotnet", 
      [ "add", testProject
      , "package", "FsCheck.Xunit"
      ]);

    if (this.commitchanges) {
      this.spawnCommandSync("git", 
        [ "add", "-A", "--", "." ]);

      this.spawnCommandSync("git", 
        [ "commit", "-m", `Added project ${this.projname}` ]);
    }
 }

  end() {
  }
}