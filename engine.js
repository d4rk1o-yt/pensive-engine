const fs = require("fs");

const appOutput = `
const components = %components%;

function load() {
  for (var c in components) {
    document.getElementById("app").innerHTML += components[c].html;
  }
}

load();
`;

class Engine {
  init() {
    const config = JSON.parse(fs.readFileSync("engine.config.json"));
    this.sourceDirectory = config.sourceDir;
    this.outputDirectory = config.outputDir;
    this.components = [];

    const args = [];
    for (const arg in process.argv) {
      if (
        !(
          process.argv[arg].includes("node") ||
          process.argv[arg].includes("app")
        )
      )
        args.push(process.argv[arg]);
    }

    const options = args.filter(value => value.startsWith("--"));
    const vars = args.filter(value => !value.startsWith("--"));

    for (const v in vars) {
      switch (vars[v]) {
        case "build":
          this.build();
          break;
        case "serve":
          const files = fs.readdirSync(this.sourceDirectory);

          this.server();
          this.build();
          console.log("Listening for file changes.");
          files.forEach(file => {
            fs.watchFile(
              this.sourceDirectory + "/" + file,
              {},
              (curr, prev) => {
                console.clear();
                this.build();
              }
            );
          });
          break;
        default:
          break;
      }
    }
  }

  build() {
    this.components = [];
    console.clear();
    console.log("Building source files:");
    const files = fs.readdirSync(this.sourceDirectory);

    files.forEach(file => {
      const data = fs.readFileSync("src/" + file);
      console.log("   += " + file);

      var d = data.toString("utf8");
      var renderReg = /(<\/?[a-z][\s\S]*>+)/;

      if (file.endsWith(".pen")) {
        if (renderReg.test(d)) {
          var html = d.match(renderReg)[0];
          html = html.replace(/(<template>|<\/template>)/, "");

          this.components.push({ html });
        }
      }
    });

    console.log("Finishing up.");
    fs.unlinkSync(this.outputDirectory + "/app.js");
    fs.writeFileSync(
      this.outputDirectory + "/app.js",
      appOutput.replace("%components%", JSON.stringify(this.components))
    );

    fs.copyFileSync(
      this.sourceDirectory + "/index.html",
      this.outputDirectory + "/index.html"
    );
  }

  server() {}
}

module.exports = new Engine().init();
