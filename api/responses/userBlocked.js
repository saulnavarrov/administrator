/**
 * userBlocked.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • log out the current user and redirect them to the login page
 *  • or send back 401 (Unauthorized) with no response body.
 *
 * Example usage:
 * ```
 *     return res.blocked();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       userBlocked: {
 *         description: 'That email address and password combination is not recognized.',
 *         responseType: 'userBlocked'
 *       }
 *     }
 * ```
 */
module.exports = function userBlocked() {

  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.userBlocked()');

  // Set Status Code
  res.status(401);

  // Entrega de datos de una vez
  return res.json({
    error: true,
    success: false,
    type: 'Block-user',
    text: 'El Usuario ha sido bloqueado por multiples intentos fallidos.'
  });
};
