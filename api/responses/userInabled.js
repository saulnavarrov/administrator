/**
 * userInabled.js
 *
 * A custom response that content-negotiates the current request to either:
 *  • serve an HTML error page about the specified token being invalid or userInabled
 *  • or send back 498 (Token userInabled/Invalid) with no response body.
 *
 * Example usage:
 * ```
 *     return res.userInabled();
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       badToken: {
 *         description: 'Provided token was expired, invalid, or already used up.',
 *         responseType: 'userInabled'
 *       }
 *     }
 * ```
 */
module.exports = function expired() {

  var req = this.req;
  var res = this.res;

  sails.log.verbose('Ran custom response: res.expired()');

  if (req.wantsJSON) {
    return res.status(497).send('Usuario No Habilitado');
  } else {
    return res.status(497).view('497');
  }

};
