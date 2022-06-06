const redis = require('redis');
const pub_client = redis.createClient(6379);
let count = 0;
let idInterval = setInterval(()=>pub_client.publish('channel-01', 'from pub_client message ' + count++), 1000);
setTimeout(()=>{clearInterval(idInterval); pub_client.quit()}, 10000);