const https = require("https");

var getOnlineDevicesReq = {
    "method": "GET",
    "hostname": process.argv[3],
    "path": "/edges/" + process.argv[4] + "/onlinedevices?tenantMgmtProxyId=" + process.argv[5],
    "port": 443,
    "headers": {
        "Authorization": "Bearer " + process.argv[2],
        "cache-control": "no-cache"
    }
}

const reqGetOnlineDevices = https.request(getOnlineDevicesReq, function(res) {
    var chunks = [];
    res.on("data", function (chunk) {
        chunks.push(chunk);
    });
    res.on("end", function() {
        var body = Buffer.concat(chunks);
        var getResp = JSON.parse(body.toString());
        var numDevices = getResp.data.length;
        for (var i = 0; i < numDevices; i++) {
            console.log(getResp.data[i].name);
            console.log("proxy: " + getResp.data[i].props.md_proxy_fqdn);
            var numSvcs = getResp.data[i].props.md_services.length;
            for (var j = 0; j < numSvcs; j++) {
                console.log("svc port: " +
                    getResp.data[i].props.md_services[j].md_service_port +
                    ":" +
                    getResp.data[i].props.md_services[j].md_service_proxy_port);
            }
        }
    });
});

reqGetOnlineDevices.end();
