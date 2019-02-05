/**
 * BankAccounts.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'BankAccounts',
  schema: true,
  attributes: {

    nombrePersonalizado: {
      type: 'string',
      required: true,
      example: 'Personalizada Cuenta',
      description: `Nombre personalizado de la cuenta, que se vizualizara en pantalla`
    },
    numAccount: {
      type: 'string',
      required: true,
      example: '16884-15-151531',
      description: `Numero de la cuenta de Ahorros o Corrientes`
    },
    fechaApertura: {
      type: 'number',
      required: true,
      example: 1543527790838.0,
      description: `Fecha de apertura de la cuenta`
    },
    balance: {
      type: 'number',
      defaultsTo: 0,
      example: '',
      description: ``
    },
    typeAccount: {
      type: 'string',
      required: true,
      example: 'CC',
      isIn: ['CA','CC'],
      description: ``
    },

    nameTypeAccount: {
      type: 'string',
      isIn: ['Cuenta Ahorros', 'Cuenta Corriente']
    },

    status: {
      type: 'string',
      isIn: ['A', 'I'],
      defaultsTo: 'I'
    },


    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // Banco de la cuenta
    bancos: {
      model: 'banks',
    },

    // Usuario que creao la cuenta de banco
    userCreated: {
      model: 'users'
    },

    // Empresa que pertenece la cuenta
    holding: {
      model: 'holdings'
    }

  },

};

