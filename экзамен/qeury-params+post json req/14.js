var http = require('http');
var url = require('url');

let http_handler=(req,res)=>
{
	if(req.method=='POST'){
		
		if(url.parse(req.url).pathname === '/'){
            let body='';
            req.on('data',chunk=>{body+=chunk.toString();});
            req.on('end',()=>{
				console.log(body);
			});


            let q = url.parse(req.url,true).query;
            res.writeHead(200,{'Content-Type': 'application/json;charset=utf-8'});
			console.log('query:',q);
            console.log(req);
    		res.end(JSON.stringify(q));
        }
        else console.log('error!');
    }
}
var server=http.createServer(function (req, res){
    http_handler(req,res);
}).listen(5000);