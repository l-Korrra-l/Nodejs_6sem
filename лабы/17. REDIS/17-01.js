const redis=require('redis');

(async () => {
  const client = redis.createClient({ url: 'redis://kora:kora123A1!@redis-12730.c275.us-east-1-4.ec2.cloud.redislabs.com:12730'})
  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('ready',()=>{console.log('ready')});
  client.on('connect',()=>{console.log('connect')});
  client.on('end',()=>{console.log('end')});
  await client.connect();
})();