module.exports = function (args) {
    var app = args.app,
        url = args.url;
    app.get('/api/event_list', function (req, res) {
        var _get = url.parse(req.url, true).query;

        // Parameters passed in URL
        var page = (_get.page) ? _get.page : '';

        res.json([
            {
                eid: 1,
                eName: "Festival",
                oName: "SIS",
                sDate: new Date(),
                eDate: new Date(),
                venue: "T-Junction",
                description: "Fun!",
                status: true
            },
            {
                eid: 2,
                eName: "Activity",
                oName: "SOE",
                sDate: new Date(),
                eDate: new Date(),
                venue: "Campus Green",
                description: "Very Fun!",
                status: false
            },
            {
                eid: 3,
                eName: "Class",
                oName: "SOA",
                sDate: new Date(),
                eDate: new Date(),
                venue: "SIS",
                description: "Super Fun!",
                status: false
            }
        ]);
    });
}