/**
 * AttemptsLogin.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  schema: true,
  tableName: 'AttemptsLogin',
  // autoCreatedAt: false,
  // autoUpdatedAt: false,
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@microsoft.com'
    },

    successType: {
      type: 'String',
      defaultsTo: 'attempt',
      isIn: ['login', 'logout', 'attempt'],
    },

    success: {
      type: 'boolean',
      defaultsTo: false
    },

    ip: {
      type: 'string'
    },

    port: {
      type: 'string'
    },

    created: {
      type: 'number',
    },

    // Desabilitando atributos
    createdAt: false,
    updatedAt: false,
    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    user: {
      model: 'users'
    }
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗╔═╗
  //  ║  ║╠═ ╠╣ ║  ╚╦╝║  ║  ╠╣ ╚═╗  ║  ║  ╠╣ ╠═╣ ║ ╠╣ ╚═╗
  //  ╚═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╚═╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝╚═╝
  beforeCreate: async (valueToCreate, proceed) => {
    const _ = require('@sailshq/lodash');

    // creando hora de registro
    valueToCreate.created = Date.now();

    // retorno de datos
    return proceed();
  },

};

