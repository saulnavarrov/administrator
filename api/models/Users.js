/**
 * Users.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */

module.exports = {

  tableName: 'users',
  schema: true,
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝╠╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    identification: {
      type: 'string',
      required: true,
      unique: true,
      maxLength: 25,
      example: '1028004969',
      description: `Numero de identificación de una persona, esta puede ser
      Cedula, Cedula Extrangera, Nit u otro numero valido para identificarse`
    },

    status: {
      type: 'string',
      isIn: ['E', 'I', 'B', 'N', 'ID'],
      example: 'N',
      description: `Estado del usuario al momento luego de crear una nueva cuenta.
        permitiendome asi sea bloquear los datos o inabilitarla
        E: Enable, funcional para trabajar.
        I: Inabled, Deshabilitado por el administrador, y solo el admin puede cambiar
            este estado debido a que la persona se fue de la empresa y paso algo.
        B: Block, Cuenta bloqueada por ingresar el password mal # de cantidad de veces.
        N: New, Es una cuenta nueva, esta es cuando se crean y aun no se ha confirmado el E-mail
            de esta cuenta nueva.
        ID: Acount Delete No habilitada, aqui el Cliente puede recuperar su cuenta
            siguiendo algunos pasos para habilitarla de nuevo `
    },

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    name: {
      type: 'string',
      required: true,
      description: 'Full representation of the user\'s name',
      maxLength: 120,
      example: 'Lisa Microwave van der Jenny'
    },

    lastName: {
      type: 'string',
      required: true,
      description: 'Last representation of the user\'s lastName',
      maxLength: 120,
      example: 'Lisa Microwave van der Jenny'
    },

    phone: {
      type: 'string',
      maxLength: 20,
      description: `Numero telefonico de la persona, tanto como datos, como para
      recuperar la contraseña en caso de haberla perdido`,
    },

    role: {
      type: 'number',
      isIn: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      defaultsTo: 9,
      description: `Rol de la persona en la compañia
        0 = 'Super Administrador',
        1 = 'Administrador',
        2 = 'Supervisor',
        3 = 'Secretaria',
        4 = 'Vendedor',
        5 = '',
        6 = '',
        7 = 'Usuario',
        8 = 'Cliente',
        9 = 'Guest'`
    },

    roleName: {
      type: 'string',
      isIn: ['Super Administrador', 'Administrador', 'Supervisor', 'Secretaria', 'Vendedor', '', '', 'Usuario', 'Cliente', 'Guest'],
      defaultsTo: 'Guest'
    },

    avatar: {
      type: 'string',
      description: `Imagen de perfil de la persona`,
      defaultsTo: '/images/avatar/avatar-1.png?exf=.png'

    },

    isSuperAdmin: {
      type: 'boolean',
      defaultsTo: false,
      description: 'Whether this user is a "super admin" with extra permissions, etc.',
      extendedDescription: `Super admins might have extra permissions, see a different default home page when they log in,
        or even have a completely different feature set from normal users.`
    },

    passwordResetToken: {
      type: 'string',
      description: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },

    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      defaultsTo: 'unconfirmed',
      description: 'The confirmation status of the user\'s email address.',
      extendedDescription: `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
        admin users).  When the email verification feature is enabled, new users created via the
        signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
        Similarly, when an existing user changes their email address, they switch to the "changeRequested"
        email status until they click the link in the confirmation email.`
    },

    emailChangeCandidate: {
      type: 'string',
      description: 'The (still-unconfirmed) email address that this user wants to change to.'
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
    },

    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ╠╣ ║║║╠╩╗╠╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // Intentos de Login
    attemptsLogin: {
      collection: 'attemptslogin',
      via: 'user'
    },

    // Asociación con Bancos
    createBanks: {
      collection: 'banks',
      via: 'userCreated'
    },

    // Cuentas de bancos
    createAccountBanks: {
      collection: 'bankAccounts',
      via: 'userCreated'
    },

    // Holdings
    createHoldings: {
      collection: 'holdings',
      via: 'userCreated'
    }


  },

  //   ╔═╗╦ ╦╔═╗╔╦╗╔═╗╔╗╔  ╔╦╗╔═╗    ╦╔═╗╔═╗╔╗╔
  //   ║  ║ ║╚═╗ ║ ║ ║║║║   ║ ║ ║    ║╚═╗║ ║║║║
  //   ╚═╝╚═╝╚═╝ ╩ ╚═╝╝╚╝   ╩ ╚═╝   ╚╝╚═╝╚═╝╝╚╝

  customToJSON: function () {
    return _.omit(this, ['password']);
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗╔═╗
  //  ║  ║╠═ ╠╣ ║  ╚╦╝║  ║  ╠╣ ╚═╗  ║  ║  ╠╣ ╠═╣ ║ ╠╣ ╚═╗
  //  ╚═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╚═╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝╚═╝
  beforeCreate: async (valueToCreate, proceed) => {
    const _ = require('@sailshq/lodash');
    let roleNames = ['Super Administrador', 'Administrador', 'Supervisor', 'Secretaria', 'Vendedor', '', '', 'Usuario', 'Cliente', 'Guest'];

    // Antes de actualizar los datos, este actualiza el campo de
    //   roleName con el numero del rol
    if (!_.isUndefined(roleNames[valueToCreate.role])) {
      valueToCreate.roleName = roleNames[valueToCreate.role];
    }

    // retorno de datos
    return proceed();
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗╔═╗  ╦ ╦╔═╗╔╦═╗╔═╗╔╦╗╔═╗╔═╗
  //  ║  ║╠═ ╠╣ ║  ╚╦╝║  ║  ╠╣ ╚═╗  ║ ║╠═╝ ║ ║╠═╣ ║ ╠╣ ╚═╗
  //  ╚═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╚═╝╚═╝╚═╝  ╚═╝╩  ═╩═╝╩ ╩ ╩ ╚═╝╚═╝
  // Actualiza el campo roleName con el nombre designado al campo rol
  // ya que son 2 arrays conjuntos
  beforeUpdate: async function (valuesToSet, proceed) {
    const _ = require('@sailshq/lodash');
    let roleNames = ['Super Administrador', 'Administrador', 'Supervisor', 'Secretaria', 'Vendedor', '', '', 'Usuario', 'Cliente', 'Guest'];

    // Antes de actualizar los datos, este actualiza el campo de
    //   roleName con el numero del rol
    if (!_.isUndefined(roleNames[valuesToSet.role])) {
      valuesToSet.roleName = roleNames[valuesToSet.role];
    }

    // Retorno de datos.
    return proceed();
  }
};

