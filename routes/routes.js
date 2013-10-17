module.exports = function(args) {
    var app = args.app;
    
    //APIs
    require('./apis')(args);
}