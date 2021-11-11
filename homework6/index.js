'use strict';

const socket = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});

const io = socket(server);

io.on('connection', client => {
    console.log('New client connected!');

    client.on('client-entered', message => {
        client.broadcast.emit('server-entered', message);
        client.emit('server-entered', message);
    });

    client.on('client-msg', data => {
        client.broadcast.emit('server-msg', data);
        client.emit('server-msg', data);
    });

    client.on('client-exit', name => {
        client.broadcast.emit('server-exit', name);
        client.emit('server-exit', name);
    });
});

server.listen(3000);
