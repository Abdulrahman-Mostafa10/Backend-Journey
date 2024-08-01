// To deal with files. you have to import the filesystem's module and use the writeFileSync method to write in the needed file
fs = require("fs");
fs.writeFileSync("first-app.txt","Hello World from NodeJS!");