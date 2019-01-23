/**
 * badRequestUpload
 *
 * @description Devolvera los Respuestas por ajax en caso de errores
 * con la carga de arhivos
 * @param {object} data Información que deseo entragar al usuario que vea
 * en pantalla en caso de errores
 * @author SaulNavarrov <sinavarrov@gmail.com>
 * @version 1.0
 */
var util = require('util');
var _ = require('@sailshq/lodash');

 /**
  * 400 (Bad Requeest) Uploads Files
  *
  * Usage:
  * return exits: {
  *   (nameError): {
  *     responseType: 'badRequestUpload',
  *     description: {contenido},
  *   }
  * }
  */

module.exports = function badRequestUpload(data) {

  // Get access to `req` and `res`
  let req = this.req;
  let res = this.res;

  // Get access to `sails`
  var sails = req._sails;

  // Log error to console
  if (!_.isUndefined(data)) {
    sails.log.verbose('Sending 400 ("Bad Request Upload") response: \n', data);
  }

  // Set Status Code
  res.status(400);

  // si no hay datos en la variable, se usa res.sendStatus().
  if(_.isUndefined(data)){

    return res.sendStatus(400);
  }


  // If the data is an Error instance and it doesn't have a custom .toJSON(),
  // then util.inspect() it instead (otherwise res.json() will turn it into an empty dictionary).
  // > Note that we don't do this in production, since (depending on your Node.js version) inspecting
  // > the Error might reveal the `stack`.  And since `res.badRequest()` could certainly be used in
  // > production, we wouldn't want to inadvertently dump a stack trace.
  if (_.isError(data)) {
    if (!_.isFunction(data.toJSON)) {
      if (process.env.NODE_ENV === 'production') {
        return res.sendStatus(400);
      }
      // No need to JSON stringify (this is already a string).
      return res.send(util.inspect(data));
    }
  }

  return res.json(data);
};
