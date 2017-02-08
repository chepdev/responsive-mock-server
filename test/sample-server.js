const path = require('path');
const mockServer = require('../src/index');
const calls = require('./sample-calls');

const server = mockServer({
  calls,
  responseDirectory: path.resolve(__dirname, 'sample-responses'),
  port: 3001
});

server.start();
