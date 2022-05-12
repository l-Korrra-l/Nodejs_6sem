const redis = require('redis');

(async () => {
const pub_client = redis.createClient({ url: 'redis://kora:kora123A1!@redis-12730.c275.us-east-1-4.ec2.cloud.redislabs.com:12730'})

pub_client.on('connect', () => {
    console.log('Connected to redis');
})
pub_client.on('ready', () => {
    console.log('ready to go');
    pub_client.publish('main_channel', 'message from publish_client');
})
pub_client.on('error', (e) => {
    console.log(`error: ${e.message}`);
})

pub_client.on('end', () => {
    console.log('end');
})

await pub_client.connect();
})();