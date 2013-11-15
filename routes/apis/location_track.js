module.exports = function (args) {
    var app = args.app,
        url = args.url,
        request = args.request,
        userHash = args.userHash,
        db = args.db;
    app.get('/api/location', function (req, res) {
        var _get = url.parse(req.url, true).query,
            eventCollection = db.collection('events');
            
        request.post('http://athena.smu.edu.sg/hestia/livelabs/index.php/user_location/userlocation', {
            form: {
                email: userHash,
                appid: "176110"
            },
            jar: true
        }, function(error, res, data) {
            console.log(data)
        });
    });
}