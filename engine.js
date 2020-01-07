const fs = require("fs");

class Engine {
 Engine() { }

 init() {
  const config = JSON.parse(fs.readFileSync("engine.config.json"));
  this.sourceDirectory = config.sourceDir;
  this.outputDirectory = config.outputDir;

  const args = [];
  for (const arg in process.argv) {
   if (!(process.argv[arg].includes("node") || process.argv[arg].includes("app"))) args.push(process.argv[arg]);
  }

  const options = args.filter(value => value.startsWith("--"));
  const vars = args.filter(value => !value.startsWith("--"));

  for (const v in vars) {
   switch (vars[v]) {
    case "build":
     console.log("Building source files:");
     const files = fs.readdirSync(this.sourceDirectory);
     files.forEach(file => {
      const data = fs.readFileSync("src/" + file);
      console.log("   += " + file);

      fs.writeFileSync(this.outputDirectory + "/" + file + ".js", data, 'utf8');
     });
     console.log("Preparing html:");
     break;
    default:
     break;
   }
  }
 }
}

module.exports = new Engine();