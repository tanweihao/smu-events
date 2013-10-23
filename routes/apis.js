module.exports = function(args) {
    var fs = args.fs,
        rootDir = args.rootDir;
    fs.readdirSync(rootDir + "/routes/apis").forEach(function(file) {
        require(rootDir + "/routes/apis/" + file)(args);
    });
};