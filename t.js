var http = require('http');

 function remoteVersion(url, cb) {
  http.get(url, function(res) {
    console.log('lets go ')
    var data = '';
      res.on('data', function (chunk){
          data += chunk;
      });

      res.on('end',function(){
          var obj = JSON.parse(data);
          cb && cb(null, obj.time);
      })
  }).on('error', function(e) {
    cb && cb(e, null)
    console.log("Got error: " + e.message);
  });  
}

exports.remoteVersion = remoteVersion;