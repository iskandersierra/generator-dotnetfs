var Gen = require('yeoman-generator');

module.exports = class extends Gen {

  constructor(args, opts) {
    super(args, opts);
  }

  initializing() {
    this.log("initializing");
  }

  prompting() {
    this.log("prompting");
    return this.prompt([{
      type    : 'input',
      name    : 'aninput',
      message : 'An input'
    }, {
      type    : 'confirm',
      name    : 'aconfirm',
      message : 'A confirm',
    }, {
      type    : 'list',
      name    : 'alist',
      message : 'A list',
      choices : ["Option #1", "Option #2", "Option #3"],
    }, {
      type    : 'password',
      name    : 'apassword',
      message : 'A password',
    }, {
      type    : 'editor',
      name    : 'aeditor',
      message : 'A editor',
    }, {
      type    : 'rawlist',
      name    : 'arawlist',
      message : 'A rawlist',
      choices : ["Option #1", "Option #2", "Option #3"],
    }]).then((answers) => {
      this.log('Answers', JSON.stringify(answers));
    });
  }

  configuring() {
    this.log("configuring");
  }

  default() {
    this.log("default");
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 1000);
    });
  }

  writing() {
    this.log("writing");
  }

  conflicts() {
    this.log("conflicts");
  }

  install() {
    this.log("install");
  }

  end() {
    this.log("end");
  }
}