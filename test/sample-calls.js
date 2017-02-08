/**
 * Here we specify all the API calls that we want the mock server to handle.
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
module.exports = {
  'get|/api/users/:userId/photos/:photoId': 'get-users-photo|200|1000',
  'post|/api/users/:userId/photos': 'create-new-user-photo|201|500',
  'get|/api/users': 'get-all-users|200|1000',
  'put|/api/users/:userId/settings': 'update-users-settings|204'
};
