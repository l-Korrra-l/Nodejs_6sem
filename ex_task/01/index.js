var http = require('http');
var open = require('open');

http.createServer((req,res)=>{
    if (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE')
    {
        let body='';
        req.on('data',chunk=>{body+=chunk.toString();});
        req.on('end',()=>{
            console.log(`method: ${req.method};`);
            console.log(new URLSearchParams(req.url));
            console.log(`body: ${body}`);
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(`method: ${req.method}; URL: ${req.url}`);
        });

    }
    else if (req.method == 'GET')
    {
        console.log(`${req.method} 404`);
        res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(`error: ${req.method} 404`);
    }
    console.log(`${req.method} 404`);
    res.writeHead(404, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(`error: ${req.method} 404`);
}).listen(3000, ()=>{console.log('listening 3000')})