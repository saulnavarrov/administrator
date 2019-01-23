/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

// Archivo Local
const loc = require('./local');

module.exports.custom = {

  // Urls base de la app
  baseUrl: loc.baseUrl,

  // Intentos de login por persona antes de bloquear la cuenta.
  attemptsLogin: loc.attemptsLogin,
  // Cantidad de tiempo para evaluar los intentos, si se hacen 5 intentos
  // fallidos en menos de 1 hora, se bloqueara el usuario y tendra que cambiar
  // la contraseña
  attemptsTime: 1 * loc.attemptsTime,

  // config locale moments
  localeMoment: loc.localeMoment,

  /**************************************************************************
   *                                                                         *
   * The TTL (time-to-live) for various sorts of tokens before they expire.  *
   *                                                                         *
   **************************************************************************/
  passwordResetTokenTTL: 24 * loc.passwordResetTokenTTL,// 24 hours
  emailProofTokenTTL:    24 * loc.emailProofTokenTTL,// 24 hours

  /**************************************************************************
   *                                                                         *
   * The extended length that browsers should retain the session cookie      *
   * if "Remember Me" was checked while logging in.                          *
   *                                                                         *
   **************************************************************************/
  rememberMeCookieMaxAge: 30 * loc.rememberMeCookieMaxAge, // 30 days

  /**************************************************************************
   *                                                                         *
   * Automated email configuration                                           *
   *                                                                         *
   * Sandbox Mailgun credentials for use during development, as well as any  *
   * other default settings related to "how" and "where" automated emails    *
   * are sent.                                                               *
   *                                                                         *
   * (https://app.mailgun.com/app/domains)                                   *
   *                                                                         *
   **************************************************************************/
  mailgunSecret: loc.mailgunSecret,
  mailgunDomain: loc.mailgunDomain,
  sendEmailtestMode: loc.sendEmailtestMode,

  // The sender that all outgoing emails will appear to come from.
  internalEmailAddress: loc.internalEmailAddress,
  fromEmailAddress: loc.fromEmailAddress,
  fromName: loc.fromName,

  // Whether to require proof of email address ownership any time a new user
  // signs up, or when an existing user attempts to change their email address.
  verifyEmailAddresses: loc.verifyEmailAddresses,

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  registerView: loc.registerView,

  // Pasarela de pagos
  stripeSecret: loc.stripeSecret,
  enableBillingFeatures: loc.enableBillingFeatures,

};
