const https = require("https");

var getEdgeReq = {
    "method": "GET",
    "hostname": process.argv[3],
    "port": 443,
    "path": "/edges?maxItems=20",
    "headers": {
        "Authorization": "Bearer " + process.argv[2],
        "cache-control": "no-cache"
    }
}

const reqGetAllEdgeIds = https.request(getEdgeReq, function(res) {
    var chunks = [];
    res.on("data", function (chunk) {
        chunks.push(chunk);
    });
    res.on("end", function() {
        var body = Buffer.concat(chunks);
        var getResp = JSON.parse(body.toString());
        var numEdges = getResp.data.length;
        for (var i = 0; i < numEdges; i++) {
            console.log(getResp.data[i].name + ":" + getResp.data[i].id)
        }
    });
});

reqGetAllEdgeIds.end();
