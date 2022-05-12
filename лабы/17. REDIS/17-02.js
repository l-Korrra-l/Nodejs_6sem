const redis = require("redis");

//   const client = redis.createClient({
//     socket: {
//       port: 12730,
//       password: "dXC8KnbhCDRM2VRccPvV1ur2Sy0FOTu9",
//       host: "redis-12730.c275.us-east-1-4.ec2.cloud.redislabs.com",
//       auth_pass: "dXC8KnbhCDRM2VRccPvV1ur2Sy0FOTu9",
//     },
//   });

(async () => {
 const client = redis.createClient({ url: 'redis://kora:kora123A1!@redis-12730.c275.us-east-1-4.ec2.cloud.redislabs.com:12730'})

  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('ready',()=>{console.log('ready')
  console.time("set_timer");
  for (let i = 0; i < 10000; i++) {
    client.set(`${i}`, `set${i}`);
  }
  console.timeEnd("set_timer");
  console.log("10000 set done");

  console.time("get_timer");
  for (let i = 0; i < 10000; i++) {
    client.get(`${i}`).then( (a) => {
      console.log(`${i}: result: ${a}`);
    })
  }
  console.timeEnd("get_timer");
  console.log("10000 get done");

  console.time("delete_timer");
  for (let i = 0; i < 10000; i++) {
    client.del(`${i}`);
  }
  console.timeEnd("delete_timer");
  console.log("10000 deleted");
});
  client.on('connect',()=>{console.log('connect')});
  client.on('end',()=>{console.log('end')});
  await client.connect();
})();

