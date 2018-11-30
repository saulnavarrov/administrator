/**
 * Customers.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

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

    sexo: {
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

    fi: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    fr: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    telFijo1: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    telFijo2: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    celular1: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    celular2: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    email: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    direccion: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    barrio: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    municipio: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    departamento: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    pais: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    categoria: {
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

    notificacionesEmail: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    notificacionesCelular1: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    notificacionesCelular2: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    empresaAsociada: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    eps: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    arl: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    ccf: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    afp: {
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

    beneficiarios: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    providerscompanies: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },


    aeps: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    aarl: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    accf: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
    aafp: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    holding: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    pagos: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    userAsesor: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },

    userCreator: {
      type: 'string',
      required: true,
      maxLength: 64,
      example: '',
      description: ``
    },
  },

};

