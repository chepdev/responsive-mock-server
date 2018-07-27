////////////////////////////////////
// Module Imports
////////////////////////////////////
const isFunction = require("lodash/isFunction");
const forEach = require("lodash/forEach");
const isEmpty = require("lodash/isEmpty");
const { resolve } = require("path");
const chalk = require("chalk");
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("./logger");

const mockServer = express();

////////////////////////////////////
// Middleware
////////////////////////////////////
mockServer.use(bodyParser.json());
mockServer.use(bodyParser.urlencoded({ extended: false }));
mockServer.use(cookieParser());

function processCall({ method, responseStatus, endpoint, fileData, timeout }) {
  mockServer.use(endpoint, (req, res, next) => {
    console.log(
      `${chalk.blue("METHOD:")} ${chalk.green(
        method.toUpperCase()
      )} ${chalk.blue("CALL:")} ${chalk.green(endpoint)}`
    );

    if (req.method.toLowerCase() === method.toLowerCase()) {
      const response = isFunction(fileData) ? fileData(req, res) : fileData;
      if (response) {
        setTimeout(() => res.status(responseStatus).json(response), timeout);
      } else {
        next();
      }
    } else {
      next();
    }
  });
}

module.exports = function({
  calls = {},
  responseDirectory,
  port = 3001,
  staticFileDirectory = false,
  staticFileMountPath = false,
  proxyStaticAssets = {}
}) {
  // Using lodash's forEach because we're iterating over a POJO
  forEach(calls, (value, key) => {
    const parts = value.split("|");
    const responseFilename = `${parts[0]}.js`;
    const responseStatus = parseInt(parts[1] || 200, 10);
    const timeout = parseInt(parts[2] || 0, 10);
    const keyParts = key.split("|");
    const method = keyParts[0];
    const endpoint = keyParts[1];
    const fileData = require(resolve(responseDirectory, responseFilename));
    processCall({ method, responseStatus, endpoint, fileData, timeout });
  });

  mockServer.start = () => {
    // Do we need to handle static files?
    if (staticFileDirectory) {
      const staticArgs = staticFileMountPath
        ? [staticFileMountPath, express.static(staticFileDirectory)]
        : [express.static(staticFileDirectory)];
      mockServer.use(...staticArgs);
    }

    if (proxyStaticAssets.path && proxyStaticAssets.hostTarget) {
      mockServer.use(proxyStaticAssets.path, (req, res) => {
        request(proxyStaticAssets.hostTarget).pipe(res);
      });
    }

    // Handle 404
    mockServer.use((req, res) => {
      console.error(chalk.red(`‼️ MISSING: 404: ${req.method} ${req.url}`));
      res.status(404).json({ error: "Endpoint doesn't exist" });
    });

    // Handle 500
    mockServer.use((error, req, res) => {
      console.error(
        chalk.red(`⚙️ SERVER ERROR: 500: ${req.method} ${req.url}`)
      );
      res.status(500).json({ error: "Internal Server Error" });
    });

    ////////////////////////////////////
    // Ready? Let's go!
    ////////////////////////////////////
    mockServer.listen(port, err => {
      if (err) {
        return logger.error(err);
      }

      return logger.appStarted(port, "MOCK");
    });
  };

  return mockServer;
};
