/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */
const l = require('./local');

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/

  // Pasarela de pagos
  stripeSecret: l.stripeSecret,

  // Email Send To MailGun
  mailgunSecret: l.mailgunSecret,
  mailgunDomain: l.mailgunDomain,
  fromEmailAddress: l.fromEmailAddress,
  fromName: l.fromName,

};
