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

  baseUrl: l.baseUrl,

  // Intentos de login por persona antes de bloquear la cuenta.
  attemptsLogin: l.attemptsLogin,
  // Cantidad de tiempo para evaluar los intentos, si se hacen 5 intentos
  // fallidos en menos de 1 hora, se bloqueara el usuario y tendra que cambiar
  // la contraseña
  attemptsTime: 1 * l.attemptsTime,

  // config locale moments
  localeMoment: l.localeMoment,

  /**************************************************************************
   *                                                                         *
   * The TTL (time-to-live) for various sorts of tokens before they expire.  *
   *                                                                         *
   **************************************************************************/
  passwordResetTokenTTL: 24 * l.passwordResetTokenTTL,// 24 hours
  emailProofTokenTTL:    24 * l.emailProofTokenTTL,// 24 hours

  /**************************************************************************
   *                                                                         *
   * The extended length that browsers should retain the session cookie      *
   * if "Remember Me" was checked while logging in.                          *
   *                                                                         *
   **************************************************************************/
  rememberMeCookieMaxAge: 30 * l.rememberMeCookieMaxAge, // 30 days

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
  mailgunSecret: l.mailgunSecret,
  mailgunDomain: l.mailgunDomain,
  sendEmailtestMode: l.sendEmailtestMode,

  // The sender that all outgoing emails will appear to come from.
  internalEmailAddress: l.internalEmailAddress,
  fromEmailAddress: l.fromEmailAddress,
  fromName: l.fromName,

  // Whether to require proof of email address ownership any time a new user
  // signs up, or when an existing user attempts to change their email address.
  verifyEmailAddresses: l.verifyEmailAddresses,

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  registerView: l.registerView,

  // Pasarela de pagos
  stripeSecret: l.stripeSecret,
  enableBillingFeatures: l.enableBillingFeatures,

};
