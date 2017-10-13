var Generator = require('yeoman-generator');
var child_process = require('child_process');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
  }

  initializing() {
  }

  prompting() {
    return this
      .prompt([{
        name: "slnname",
        type: "input",
        message: "Solution name",
        store: true,
        validate: (v) => {
          if (v && v.match("[A-Za-z0-9\\-]+(\\.[A-Za-z0-9\\-]+)*")){
            return true;
          } else {
            return "Solution name must be of the form <Name>(.<Name>)*"
          }
        }
      }, {
        name: "initialcommit",
        type: "input",
        message: "Initial commit message",
        default: "Initial commit",
        store: true,
      }, {
        name: "gitremote",
        type: "input",
        message: "Git remote repository",
        default: "<none>",
        store: false,
      }]).then(answers => this.answers = answers);
  }

  configuring() {
    if (this.answers.slnname.endsWith(".sln")) {
      this.answers.slnname =
        this.answers.slnname.substring(this.answers.slnname.length - 4);
    }

    if (!this.answers.initialcommit) {
      this.answers.initialcommit = "Initial commit";
    }
  }

  default() {
  }

  writing() {
    this.fs.copy(
      this.templatePath("copy"),
      this.destinationPath()
    );
  }

  install() {
    this.spawnCommandSync(
      "dotnet", 
      [
        "new", "sln",
        "--output", ".",
        "--name", this.answers.slnname,
      ]
    );

    this.spawnCommandSync("git", [ "init", ]);

    this.spawnCommandSync("git", [ "add", "-A", "--", "." ]);

    this.spawnCommandSync(
      "git", 
      [
        "commit",
        "-m", this.answers.initialcommit,
      ]
    );

    if (this.answers.gitremote !== "<none>") {
      this.spawnCommandSync(
        "git", 
        [
          "remote", "add", "origin",
          this.answers.gitremote,
        ]
      );

      this.spawnCommandSync(
        "git", 
        [
          "push", 
          "-u", "origin",
          "--all",
        ]
      );
    }

  }

  end() {
  }
}
