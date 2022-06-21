var http =require('http');
var query= require('querystring');

let parms=query.stringify({x:3,y:4});

let options= {
    host: 'localhost',
    path: `/?${parms}`,
    port: 5000,
    method:'POST',
    headers:{'content-type':'application/json', 'accept':'application/json'}
}

const req = http.request(options,(res)=> {
    res.on('data',(data) => {console.log(data.toString())});
    res.on('end',()=>{ console.log('end')}); 
});
req.write(JSON.stringify({hi:'hi'}));
req.on('error', (e)=> {console.log('http.request: error:', e.message);});
req.end();