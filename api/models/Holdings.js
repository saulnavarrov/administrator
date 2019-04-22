/**
 * Holdings.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'Holdings',
  schema: true,
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    own: {
      type: 'string',
      isIn: ['P','T'],
      defaultsTo: 'T',
      description: `Por si la empresa es propia o de un tercero al cual le manejamos la
      todas las aseguraciones.
      P= Propias,
      T= Terceros o asociados a nuestra empresa`
    },
    emailAddress: {
      type: 'string',
      unique: true,
      description: 'Correo electronico de la empresa que se esta inscribiendo'
    },

    reasonName: {
      type: 'string',
      example: 'Union Empresarial Colombiana SAS',
      description: `Nombre completo de la razon social`
    },
    enrollment: {
      type: 'number',
      example: 1234567890,
      required: true,
      unique: true,
      max: 100000000,
      min: 1000000,
      description: `Numero de la matricula inscrita en camara de comercio`
    },
    identification: {
      type: 'number',
      example: 123456789,
      required:true,
      unique: true,
      max: 100000000000000,
      min: 1000000,
      description: `Numero de identificación o Nit`
    },
    consecutive: {
      type: 'number',
      max: 2,
      required: true,
      example: 2,
      description: `Numero consecutivo del Nit este va despues del guion`
    },
    status: {
      type: 'string',
      isIn: ['A', 'I', 'S', 'C'],
      example: 'A',
      description: `Estado de la empresa actualemnte
      A = Activo
      I = Inactivo
      S = Suspendido
      C = Cancelada`,
    },
    statusName: {
      type: 'string',
      isIn: ['Activo', 'Inactivo', 'Suspendido', 'Cancelada'],
      example: 'Activo',
      description: 'Nombre del estado'
    },
    renewedDate: {
      type: 'number',
      example: '2019',
      description: `Ultima fecha de renovación de la matricula`
    },
    createdDate: {
      type: 'string',
      example: '2019-01-01',
      description: `fecha en la que fue inscrita la matricula en camara de comercio`
    },
    acronym: {
      type: 'string',
      example: 'Uniempresas',
      description: `Nombre corto de la empresa`
    },
    location: {
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

    balance: {
      type: 'number',
      defaultsTo: 0
    },

    inBalance: {
      type: 'number',
      defaultsTo: 0
    },

    outBalance: {
      type: 'number',
      defaultsTo: 0
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    // Usuario quien crea esta empresa
    userCreated: {
      model: 'users',
      description: ``
    },

    // Cuenta de banco asociada
    bankAccount: {
      collection: 'bankAccounts',
      via: 'holding',
      description: ``
    },
  },


  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗╔═╗  ╔═╗╦  ╔═╗╔═╗╔╦╗╔═╗╔═╗
  //  ║  ║╠═ ╠╣ ║  ╚╦╝║  ║  ╠╣ ╚═╗  ║  ║  ╠╣ ╠═╣ ║ ╠╣ ╚═╗
  //  ╚═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╚═╝╚═╝╚═╝  ╚═╝╚═╝╚═╝╩ ╩ ╩ ╚═╝╚═╝
  beforeCreate: async (valueToCreate, proceed) => {
    const _ = require('@sailshq/lodash');
    let statusName = {
      'A': 'Activo',
      'I': 'Inactivo',
      'S': 'Suspendido',
      'C': 'Cancelada'
    };

    // Antes de crear los datos, este Agergara y rellena el nombre del
    // nombre del estado
    if (!_.isUndefined(statusName[valueToCreate.status])) {
      valueToCreate.statusName = statusName[valueToCreate.status];
    }

    // Retorno de datos.
    return proceed();
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗╔═╗  ╦ ╦╔═╗╔╦═╗╔═╗╔╦╗╔═╗╔═╗
  //  ║  ║╠═ ╠╣ ║  ╚╦╝║  ║  ╠╣ ╚═╗  ║ ║╠═╝ ║ ║╠═╣ ║ ╠╣ ╚═╗
  //  ╚═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╚═╝╚═╝╚═╝  ╚═╝╩  ═╩═╝╩ ╩ ╩ ╚═╝╚═╝
  beforeUpdate: async function (valuesToSet, proceed) {
    const _ = require('@sailshq/lodash');
    let statusName = {
      'A': 'Activo',
      'I': 'Inactivo',
      'S': 'Suspendido',
      'C': 'Cancelada'
    };

    // Antes cuando se actualiza los datos de una compañia, este actualizra de
    // manera automatica el nombre del estado
    if (!_.isUndefined(statusName[valuesToSet.status])) {
      valuesToSet.statusName = statusName[valuesToSet.status];
    }

    // Retorno de datos.
    return proceed();
  }
};

