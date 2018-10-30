/**
 * find-search.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find one',

  description: `Busca un usuario especifico en la base de datos y lo devuelve
  haciendolo funcionar con el buscador si contontine tal dato, en 3 columnas
  el Nombre, Apellido, E-mail`,

  inputs: {
    count: {
      type:'boolean',
      defaultsTo: false,
      description: `Permitira hacer el conteo de todos los usuarios
      este funcionara si esta activo y devolvera el numero de datos
      encontrados`
    },
    lim: {
      type: 'number',
      defaultsTo: 10,
      description: `Cantidad de resultados que entregara por cada
      llamada que se realize al listado`
    },
    sk: {
      type: 'number',
      defaultsTo: 0,
      description: `Omitira una cantidad de listados y visualizara en
      en cantidades por limites, usado para paginar la cantidad de resultados
      que se entregan en la vista`
    },
    finds: {
      type: 'string',
      defaultsTo: '',
      description: `Se usaria para hacer busqueda en la tabla de usuarios, actualmente
      no funciona en la accion "users/list" sino que va a funcionar en la
      accion "users/find-one"`
    }
  },

  exits: {
    success: {
      description: 'Entrega de usuarios Exitosa.'
    },

    notFound: {
      responseType: 'notFound',
      description: 'Datos no encontrados de los usuario o no existe ninguno'
    },

    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },


  // funcion final de entraga de datos
  fn: async function (inputs, exits) {
    let _ = require('lodash');
    let rq = this.req;
    let users = []; // array de usuario nuevo
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    // formateando datos para busquedas exactas ya que sin camelcase
    let uid = String(inputs.finds);
    let searchEmail = _.lowerCase(String(inputs.finds));
    let searchName = _.startCase(_.lowerCase(String(inputs.finds)));
    let searchLastName = _.startCase(_.lowerCase(String(inputs.finds)));

    // Verificacion de usuario
    if (!userId && !isSocket) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Filtro
    let findContainer = [
      { 'id':           { 'contains': uid } },
      { 'emailAddress': { 'contains': searchEmail } },
      { 'name':         { 'contains': searchName } },
      { 'lastName':     { 'contains': searchLastName } },
      { 'id':           { 'contains': inputs.finds } },
      { 'emailAddress': { 'contains': inputs.finds } },
      { 'name':         { 'contains': inputs.finds } },
      { 'lastName':     { 'contains': inputs.finds } }
    ];

    // funcion de buscador, donde buscara de los 3 la funcion
    let findUsers = await User.find()
      .where({ 'or': findContainer })
      .limit(inputs.lim)
      .skip(inputs.lim * inputs.sk);

    // Cuenta el numero de resultados
    count = await User.find()
      .where({ 'or': findContainer });

    count = count.length;

    // Protegiendo el Password para no visualizarlo en Json
    for (user of findUsers) {
      delete user.password;
      if (user.role > 1) {
        delete user.isSuperAdmin;
      }
      users.push(user);
    }

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'users',
      count: count,
      list: users
    });
  }
};
