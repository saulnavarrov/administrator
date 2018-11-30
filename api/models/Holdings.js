/**
 * Holdings.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    nombreRazon: {
      type: 'string',
      example: 'Union Empresarial Colombiana SAS',
      description: `Nombre completo de la razon social`
    },
    matricula: {
      type: 'number',
      example: 1234567890,
      required: true,
      unique: true,
      max: 100000000,
      min: 1000000,
      description: `Numero de la matricula inscrita en camara de comercio`
    },
    identificacion: {
      type: 'number',
      example: 123456789,
      required:true,
      unique: true,
      max: 100000000000000,
      min: 1000000,
      description: `Numero de identificación o Nit`
    },
    consecutivo: {
      type: 'number',
      max: 2,
      required: true,
      example: 2,
      description: `Numero consecutivo del Nit este va despues del guion`
    },
    estado: {
      type: 'string',
      isIn: ['A', 'I', 'S', 'C'],
      example: 'activo',
      description: `Estado de la empresa actualemnte
      A = Activo
      I = Inactivo
      S = Suspendido
      C = Cancelada`,
    },
    fechaRenovado: {
      type: 'string',
      example: '10/2018',
      description: `Ultima fecha de renovación de la matricula`
    },
    fechaCreado: {
      type: 'string',
      example: '10/2010',
      description: `fecha en la que fue inscrita la matricula en camara de comercio`
    },
    siglas: {
      type: 'string',
      example: 'Uniempresas',
      description: `Nombre corto de la empresa`
    },
    ubicacion: {
      type: 'string',
      example: 'Medellin',
      description: `ubicación de la empresa actualmente`
    },
    maxCustomersEps: {
      type: 'number',
      example: 200,
      description: `Configuración para el numero de usuario o clientes que puede manejar esta empresa por
      eps, para evitar fallos en ellas
      esta solo enviara una alerta cuando se encuentre llegando al numero que fue configurado
      mas no limitara la iscripcion de los usuarios`
    },

    maxCustomersArl: {
      type: 'number',
      example: 200,
      description: `Configuración para el numero de usuario o clientes que puede manejar esta empresa por
      eps, para evitar fallos en ellas
      esta solo enviara una alerta cuando se encuentre llegando al numero que fue configurado
      mas no limitara la iscripcion de los usuarios`
    },

    maxCustomersCaja: {
      type: 'number',
      example: 200,
      description: `Configuración para el numero de usuario o clientes que puede manejar esta empresa por
      eps, para evitar fallos en ellas
      esta solo enviara una alerta cuando se encuentre llegando al numero que fue configurado
      mas no limitara la iscripcion de los usuarios`
    },

    maxCustomersAfp: {
      type: 'number',
      example: 200,
      description: `Configuración para el numero de usuario o clientes que puede manejar esta empresa por
      eps, para evitar fallos en ellas
      esta solo enviara una alerta cuando se encuentre llegando al numero que fue configurado
      mas no limitara la iscripcion de los usuarios`
    },

    saldoActual: {
      type: 'number',

    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    userCreate: {
      type: 'string',
      example: '',
      description: ``
    },
    bankaccounts: {
      type: 'string',
      example: '',
      description: ``
    },
  },

};

