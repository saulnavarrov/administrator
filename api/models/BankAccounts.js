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
    nunCuenta: {
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
    fechaVencimiento: {
      type: 'string',
      required: true,
      example: '05/19',
      description: `fecha cuando vence cuando vence la tarjeta`
    },
    saldo: {
      type: 'number',
      required: true,
      example: '',
      description: ``
    },
    tipoCuenta: {
      type: 'string',
      required: true,
      example: 'cc',
      isIn: ['CA','CC'],
      description: ``
    },

    nameTypeAcount: {
      type: 'string',
      isIn: ['Cuenta Ahorros', 'Cuenta Corriente']
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
    banco: {
      type:'string',
      example: 'Bancolombia',
      description: `Nombre del banco donde esta esta cuenta`
    },

    userCreated: {
      type: 'string'
    },

    holdings: {
      type: 'string',
    }

  },

};

