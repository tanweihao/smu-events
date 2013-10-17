module.exports = function(args) {
    var fs = require("fs"),
        rootDir = args.rootDir;
    fs.readdirSync(rootDir + "/routes/apis").forEach(function(file) {
        require(rootDir + "/routes/apis/" + file)(args);
    });
};