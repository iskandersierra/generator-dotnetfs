var Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.answers = {};
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
        default: "<same as project name>"
      }, {
        name: "gentests",
        type: "confirm",
        message: "Generate xUnit tests",
        default: true,
      }]).then(answers => this.answers = answers);
  }

  configuring() {
    this.config.projname = this.answers.projname
    this.config.save();
  }

  install() {
    this.log("Answers: " + JSON.stringify(this.answers));
    this.log("Config: " + JSON.stringify(this.config));
    var oldConfig = require(this.config.path);
    this.log("Config: " + JSON.stringify(oldConfig));
  }  
  
}