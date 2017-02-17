# Responsive Mock Server
A configurable ExpressJS server that will allow you to easily mock out API calls using plain old Javascript functions.

There are a bunch of really great mock servers out there with loads of bells and whistles. This mock server prides itself on being simple and allowing you to have fully dynamic responses. Because the responses are just normal JS functions and you have access to the ExpressJS `request` object, you can return any response based on the given call. This allows you to, for instance, return a user object with the given user's ID injected, making your mocks seem a lot more personal.

Check out the `test` directory if you want to see a working sample server with calls and responses.


## Installation
NPM install (install as devDependency if you want)
```bash
npm i -D responsive-mock-server
```

or if you 😍 `yarn`

```bash
yarn add --dev responsive-mock-server
```

## Usage

1. First create your server file with all your API calls.

```
// Import the package
const mockServer = require('responsive-mock-server');
const path = require('path');

// Create new instance of the mock server, passing in the required configuration options.
const server = mockServer({
  /**
   * Here we specify all the API calls that we want the mock server to handle.
   *
   * PRO TIP: Put all your calls in a separate file and import/require it here to keep this file clean.
   *
   * The signature for an entry is as follows:
   * 'method|endpoint': 'fixture|statusCode|timeout'
   *
   * method:      The HTTP method (get|post|put|delete, etc)
   * endpoint:    The relative URL endpoint eg. '/api/users/:userId/photos'
   *              Variables are handled by a leading colon, like the `:globalId` in the example and will be available
   *              to your fixture file. The endpoints are just Express endpoints, so anything you can do in Express
   *              you can do here.
   * fixture:     Name of the JavaScript fixture file (without .js extension) that is in your `responseDirectory (defaults to `responses`)
   * statusCode:  HTTP status code that the mock server should respond with, eg. 200, 401, etc
   * timeout:     (Optional) time in milliseconds that the response should wait before responding to the call.
   *              This can be used to simulate the time a call might take on the server.
   */
  calls: {
    'get|/api/users/:userId/photos/:photoId': 'get-users-photo|200|1000',
    'post|/api/users/:userId/photos': 'create-new-user-photo|201|500',
    'get|/api/users': 'get-all-users|200|1000',
    'put|/api/users/:userId/settings': 'update-users-settings|204'
  },
  // Absolute path to where your response/fixture files are stored
  responseDirectory: path.resolve(__dirname, 'your-responses-directory'),
  // Optional absolute path to where your static files are stored (ignore this if you don't serve up static files)
  fileStaticDirectory: path.resolve(__dirname, 'your-static-files-directory'),
  // Optional mount path if you want to create a virtual prefix from which static files should be served (only takes affect if `fileStaticDirectory` is set)
  fileStaticMountPath: '/public',
  // Optional port, defaults to 3001
  port: 3001
});

// Finally, start this sucker up! 🚀
server.start();
```

2. Now, make sure you create the response files for each of your calls.
It is important that the name you specify as the `fixture` in the calls object matches the file names exactly.

Based on the example above you will have 4 fixture files in the `./your-responses-directory`, namely:
* get-users-photo.js
* create-new-user-photo.js
* get-all-users.js
* update-users-settings.js

Each of the response/fixture files should export a function that will receive a normal ExpressJS `request` and `response` object.
You will at most only need the `request` object if you want to make your mock responses dynamic based on given
URL or query parameters. The mock server will automatically parse the responses for you and make these available on the
`request` object.

```
// Example response for `create-new-user-photo.js`
module.exports = function(req, res) {
  const userId = req.params.userId;
  return {
    'status': 'OK',
    'message': `Nice one! Photo created successfully for user: ${userId}!`
  };
};
```
