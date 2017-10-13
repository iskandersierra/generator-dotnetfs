var Generator = require('yeoman-generator');

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
        store: false,
      }, {
        name: "gitremote",
        type: "input",
        message: "Git remote repository",
        default: "<none>",
        store: false,
      }]).then(answers => {
        this.slnname = answers.slnname;
        this.initialcommit = answers.initialcommit;
        this.gitremote = answers.gitremote;
        if (this.slnname.endsWith(".sln")) {
          this.slnname =
            this.slnname.substring(this.slnname.length - 4);
        }
        if (!this.gitremote || this.gitremote === "<none>") {
          this.gitremote = null;
        }
      });
  }

  configuring() {
    this.config.set("slnname", this.slnname);
    this.config.save();
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
    this.spawnCommandSync("dotnet", 
      [ "new", "sln", "--output", ".", "--name", this.slnname ]);

    this.spawnCommandSync("git", 
      [ "init", ]);

    this.spawnCommandSync("git", 
      [ "add", "-A", "--", "." ]);

    this.spawnCommandSync("git", 
      [ "commit", "-m", this.initialcommit ]);

    if (this.gitremote) {
      this.spawnCommandSync("git", 
        [ "remote", "add", "origin", this.gitremote ]);

      this.spawnCommandSync("git", 
        [ "push", "-u", "origin", "--all" ]);
    }
  }

  end() {
  }
}