/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

module.exports = {

  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)

  // Configiguración de locale moment para verlo en español
  localeMoment: 'es',

  // Miselanea
  baseUrl:  [
    'urls',
    'urls',
    'urls'],

  internalEmailAddress: '[support@example.com]',

  // Time Max Remember Me Cookie Max Age
  rememberMeCookieMaxAge: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Token TTL Password Rest time
  passwordResetTokenTTL: 24 * 60 * 60 * 1000,// 24 hours

  // Email Token New
  emailProofTokenTTL: 24 * 60 * 60 * 1000,// 24 hours

  // Pasarela de pagos Stripe
  stripeSecret: null,

  // Permitir el registro desde la Pagina View sin Restricciones.
  registerView: false,

  // Verify Email Address User New
  verifyEmailAddresses: true,

  // Email Send To MailGun
  mailgunSecret: '[token]',
  mailgunDomain: '[domain.com]',
  fromEmailAddress: 'postmaster@domain.com',
  fromName: '[Full Name]',
  sendEmailtestMode: false,

  // Key Encriptation Data
  dataEncryptionKeys: {
    default: '[Obligatorion palabra para encriptar]'
  },

  // Key Encriptation Session
  secretSession: '[Obligatorion palabra para encriptar]',

  // Base de datos
  db: {
    production:{
      adapter: '[adactador]',
      user: '[Usuario]',
      pass: '[Contraseña]',
      url: '[localhost en caso tal]',
      port: 0,
      db: '[base de datos]',
      type: {}, // Mongodb: { type: 'string', columnName: '_id' }, MySQL: { type: 'number', autoIncrement: true, },
      ssl: false,
    },
    development: {
      adapter: '[adactador]',
      user: '[Usuario]',
      pass: '[Contraseña]',
      url: '[localhost en caso tal]',
      port: 0,
      db: '[base de datos]',
      type: {}, // Mongodb: { type: 'string', columnName: '_id' }, MySQL: { type: 'number', autoIncrement: true, },
      ssl: false,
    },
  },

  // Conectores para las Sessiones de App
  connect: {
    production: {
      connect: '[adapter]',
      user: '[usuario]',
      pass: '[contraseña]',
      url: '[url]',
      port: 0,
      db: '[nomber de la base de datos]',
    },
    development: {
      connect: '[adapter]',
      user: '[usuario]',
      pass: '[contraseña]',
      url: '[url]',
      port: 0,
      db: '[nomber de la base de datos]',
    }
  }
};
