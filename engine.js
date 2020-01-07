const fs = require("fs");

class Engine {
 Engine() { }

 init() {
  var count = 0;
  fs.readdirSync("src").forEach((file) => {
   if (file.includes(".eg")) {
    count++;

    fs.readFile("src/" + file, 'utf8', (err, data) => {
     if (err) throw err;

     fs.writeFileSync("dist/" + file + ".js", data);
     const f = require("./dist/" + file);
     console.log(f.render());
    });
   }
  });
  console.log(`Found ${count} Engine files.`);
 }
}

module.exports = new Engine();