//С: пересылка файла в POST (upload)
//браузер

var http = require('http');
var url = require('url');
var fs = require('fs');
let mp=require('multiparty');

let writeHTTP405=(res)=>{
	res.statusCode = 405;
	res.statusMessage = 'Use another method';
	res.end('Use another method');
}

let http_handler=(req,res)=>
{
	if(req.method=='GET'){
		if(url.parse(req.url).pathname=== '/upload')
		{
			let html= fs.readFileSync('12form.html');
			res.writeHead(200,{'Content-Type': 'text/html; charset=utf-8'});
			res.end(html);
		}
		else res.end('Nothing on this pages');
	}
	else if(req.method=='POST'){
		if(url.parse(req.url).pathname=== '/upload')
			{
				let result='';
				let form =new mp.Form({uploadDir:'./static'});///
				form.on('field',(name,value)=>{
					console.log('------------field-------------');
					console.log(name,value);
					result+=`<br/>---${name}= ${value}`;
				});
				form.on('file', (name, file)=>{
					console.log('-----file ------------');
					console.log(name,file);
					result+=`<br/>---${name}= ${file.originalFilename}: ${file.path}`;
				});
				form.on('error',(err)=> {
					console.log('------err--------------');
					console.log('err =',err);
					res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
					res.write('<h1>Form/error</h1>');
					res.end()
				});
				form.on('close',()=>{
					console.log('-----------close----------');
					res.writeHead(200, {'Content-Type':'text/html;charset=utf-8'});
					res.write('<h1>Form</h1>');
					res.end(result);
				})
				form.parse(req);
		}
		else res.end('Nothing on this pages');
	}
	else writeHTTP405(res);
}
http.createServer(function (req, res){http_handler(req,res);
}).listen(3000);