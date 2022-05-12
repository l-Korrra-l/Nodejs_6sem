const redis = require('redis');

(async () => {
const sub_client = redis.createClient({ url: 'redis://kora:kora123A1!@redis-12730.c275.us-east-1-4.ec2.cloud.redislabs.com:12730'})

sub_client.on('connect', () => {
    console.log('Connected to redis');
})
sub_client.on('ready', () => {
    console.log('ready to go');
    sub_client.subscribe('main_channel');
})
sub_client.on('error', (e) => {
    console.log(`error: ${e.message}`);
})

sub_client.on('end', () => {
    console.log('end');
})

sub_client.on('subscribe', (channel, count) => {console.log(`subscribed: channel: ${channel}, count: ${count}`)});
sub_client.on('message', (channel, message) => {console.log(`Message from ${channel}: ${message}`)});
await sub_client.connect();
})();

