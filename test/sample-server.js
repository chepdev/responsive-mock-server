const path = require("path");
const mockServer = require("../src/index");
const calls = require("./sample-calls");

const server = mockServer({
  calls,
  responseDirectory: path.resolve(__dirname, "sample-responses"),
  staticFileDirectory: path.resolve(__dirname, "sample-files"),
  staticFileMountPath: "/public",
  port: 3001,
  proxyStaticAssets: {
    path: "/storage/assets/*",
    hostTarget: "https://google.com/"
  }
});

server.start();
