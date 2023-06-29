const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    password: process.env.redisPass,
    socket: {
        host: 'redis-13146.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13146
    }
});

const redisConnect = client.connect();

module.exports = {client,redisConnect}
