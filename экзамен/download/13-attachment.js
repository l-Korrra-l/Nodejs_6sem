var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
  var files = fs.createReadStream("package.json");
  res.writeHead(200, {'Content-disposition': 'attachment; filename=package.json'}); 
  files.pipe(res); 
}).listen(3000); 
