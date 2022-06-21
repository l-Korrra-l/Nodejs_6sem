var http = require('http');
var fs = require('fs');
var url = require('url');

http.createServer( function(request, response){
    if(url.parse(request.url).pathname == '/png'){
        if(request.method === 'GET'){
            let fname = './static/file.png';
            let png = null;

            fs.stat(fname, (err, stat)=>{
                if(err) console.log('error', err);
                else {
                    png = fs.readFileSync(fname);
                    response.writeHead (200, {'content-type': 'image/png', 
                        'Content-Length' : stat.size});
                    response.end(png, 'binary');
                }
            })
        }
        else response.end('error request');
    }
    else if(url.parse(request.url).pathname != '/png') response.end('GO to localhost:5000/png');
}).listen(5000);

console.log('server running at localhost:5000 ')