/**
 * Beneficiaries.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    tipo: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    identificacion: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    nombre1: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    nombre2: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    apellido1: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    apellido2: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    fechaNacimiento: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    sexo: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    parentesco: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    status: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    sucotizantes: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
  },

};

