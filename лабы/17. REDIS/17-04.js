const redis = require("redis");
(async () => {
 const client = redis.createClient({ url: 'redis://kora:kora123A1!@redis-12730.c275.us-east-1-4.ec2.cloud.redislabs.com:12730'})

  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('ready',()=>{
  console.log("ready");
  console.time('hset_timer');
  for (let i = 0; i < 10000; i++){
      client.hSet(`${i}`,`value`,`val-${i}`);
  }
  console.timeEnd('hset_timer');
  
  
  console.time('hget_timer');
  for (let i = 0; i < 10000; i++){
      client.hGet(`${i}`,'value').then((a)=>{
          console.log(a);
      });
  }
  console.timeEnd('hget_timer');
});
  client.on('connect',()=>{console.log('connect')});
  client.on('end',()=>{console.log('end')});
  await client.connect();
})();

