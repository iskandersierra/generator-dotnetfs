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
        this.log("Answers: " + JSON.stringify(answers));
        for(var key in Object.keys(answers)) {
          this.config.set(key, answers[key]);
        }
      });
  }

  configuring() {
    this.log("Config: " + JSON.stringify(this.config));
    var slnname = this.config.get("slnname");
    var initialcommit = this.config.get("initialcommit");

    if (slnname.endsWith(".sln")) {
      this.set("slnname", slnname.substring(slnname.length - 4));
    }

    if (!initialcommit) {
      this.config.set("initialcommit", "Initial commit");
    }

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
    this.log("Config: " + JSON.stringify(this.config));
    var slnname = this.config.get("slnname");
    var initialcommit = this.config.get("initialcommit");
    var gitremote = this.config.get("gitremote");
    
    this.spawnCommandSync(
      "dotnet", 
      [
        "new", "sln",
        "--output", ".",
        "--name", slnname,
      ]
    );

    this.spawnCommandSync("git", [ "init", ]);

    this.spawnCommandSync("git", [ "add", "-A", "--", "." ]);

    this.spawnCommandSync(
      "git", 
      [
        "commit",
        "-m", initialcommit,
      ]
    );

    if (gitremote !== "<none>") {
      this.spawnCommandSync(
        "git", 
        [
          "remote", "add", "origin",
          gitremote,
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
