/**
 * BankAccounts.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'Banks',
  schema: true,
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombre: {
      type: 'string',
      required: true,
      unique: true,
      description: 'nombre del banco real'
    },

    pais: {
      type: 'string',
      defaultsTo: ''
    },

    nit: {
      type: 'string',
      defaultsTo: '00000000000000',
      maxLength: 15,
      minLength: 6
    },

    consecutive: {
      type: 'string',
      defaultsTo: '0',
      maxLength: 2
    },

    status: {
      type: 'string',
      isIn: ['A','I'],
      defaultsTo: 'I'
    },

    phone: {
      type: 'string',
      defaultsTo: '',
    },

    ach: {
      type: 'string',
      defaultsTo: '',
    },

    bankNacional: {
      type: 'string',
      defaultsTo: '',
      isIn: ['','**','Si','No']
    },

    balance: {
      type: 'number',
      defaultsTo: 0,
      example: '',
      description: ``
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    userCreated: {
      model: 'users'
    },

    bankAccount: {
      collection: 'bankaccounts',
      via: 'bancos'
    }

  },

};
