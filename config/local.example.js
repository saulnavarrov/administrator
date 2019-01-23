/**
 * Local environment settings
 *
 * Use this file to specify configuration settings for use while developing
 * the app on your personal system.
 *
 * For more information, check out:
 * https://sailsjs.com/docs/concepts/configuration/the-local-js-file
 */

// Http or Https
let secureHttps = false;

module.exports = {

  // Any configuration settings may be overridden below, whether it's built-in Sails
  // options or custom configuration specifically for your app (e.g. Stripe, Mailgun, etc.)


  // ================================ CONFIGURATION APP ================================
  // Intentos de login por persona antes de bloquear la cuenta.
  attemptsLogin: 5,
  // Cantidad de tiempo para evaluar los intentos, si se hacen 5 intentos
  // fallidos en menos de 1 hora, se bloqueara el usuario y tendra que cambiar
  // la contraseña
  attemptsTime: 60 * 60 * 1000,

  // Configiguración de locale moment para verlo en español
  localeMoment: 'es',

  https: !secureHttps,

  // Miselanea
  baseUrl:  [
    `${secureHttps?'https':'http'}://{{host}}`
  ],

  internalEmailAddress: 'email',

  // Time Max Remember Me Cookie Max Age
  rememberMeCookieMaxAge: 24 * 60 * 60 * 1000, // 1 days

  // Token TTL Password Rest time
  passwordResetTokenTTL: 1 * 60 * 60 * 1000,// 1 hours

  // Email Token New
  emailProofTokenTTL:    1 * 60 * 60 * 1000,// 24 hours

  // Pasarela de pago habilitada
  enableBillingFeatures: false,

  // Pasarela de pagos Stripe
  stripeSecret: null,

  // Permitir el registro desde la Pagina View sin Restricciones.
  registerView: false,

  // Verify Email Address User New
  verifyEmailAddresses: true,

  // Email Send To MailGun
  mailgunSecret: '',
  mailgunDomain: '',
  fromEmailAddress: '',
  fromName: '',
  sendEmailtestMode: false,

  // Key Encriptation Data
  dataEncryptionKeys: {
    default: ''
  },

  // Key Encriptation Session
  secretSession: '',

  // Base de datos
  db: {
    production:{
      adapter: '',
      user: '',
      pass: '',
      url: '',
      port: 0,
      db: '',
      // type: { type: 'string', columnName: '_id' },
      ssl: false,
    },
    development: {
      adapter: '',
      user: '',
      pass: '',
      url: '',
      port: 0,
      db: '',
      // type: { type: 'string', columnName: '_id' },
      ssl: false,
    },
  },

  // Conectores para las Sessiones de App
  connect: {
    production: {
      connect: '',
      user: '',
      pass: '',
      url: '',
      port: 0,
      db: '',
    },
    development: {
      connect: '',
      user: '',
      pass: '',
      url: '',
      port: 0,
      db: '',
    }
  }
};
