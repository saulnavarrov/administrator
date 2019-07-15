// `config/apianalytics.js`

module.exports = {

  apianalytics: {

    /**
     * An array of route addresses to monitor.
     *
     * (e.g. [ 'GET /foo/bar', 'POST /foo', 'all /admin/*' ])
     *
     * Defaults to logging all POST, PATCH, PUT, DELETE requests, and all
     * GET requests except for those that appear to be for assets
     * (i.e. using "GET r|^((?![^?]*\\/[^?\\/]+\\.[^?\\/]+(\\?.*)?).)*$|")
     */
    routesToLog: [
      // If you want to log everything- including requests for assets, use the following:
      '/*'
    ],

    /**
     * Request parameters which should NEVER be logged.
     * If seen, they will be replaced with "*REDACTED*"
     *
     * (e.g. "password")
     *
     * > WARNING:
     * > This is a SHALLOW check of request body, querystring, and route path parameters.
     * > Deeply nested properties with these names are not redacted.
     */
    dontLogParams: [
      'password',
      'token'
    ]
  }
};
