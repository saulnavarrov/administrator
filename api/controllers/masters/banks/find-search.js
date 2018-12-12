/**
 * find-search.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find search',

  description: `Busca un banco especifico en la base de datos y lo devuelve
  haciendolo funcionar con el buscador si contontine tal dato, en 3 columnas
  el nit, nombre, id, consecutivo`,

  inputs: {
    count: {
      type: 'boolean',
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


  fn: async function (inputs, exits) {
    let _ = require('lodash');
    let rq = this.req;
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let banks = []; // array de bancos nuevo
    let count = 0;


    /******************** BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS *********************/

    // Verificacion de usuario
    if (!userId && !isSocket) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await User.findOne({'id': userId});
    // Autorización de usuarios
    let autorize = user.role <= 2 ? true : false;
    // Verifico que usuario tiene pases de seguridad para ver el listado de bancos
    if (!autorize) { throw 'unauthorized'; }

    /******************** BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS *********************/
    //                                                                                    *
    //                                                                                    *
    //                                                                                    *
    //                                                                                    *
    /*********************** BLOQUE DE TRABAJO DE DATOS DEL SISTEMA ***********************/

    // formateando datos para busquedas exactas ya que sin camelcase
    let uid = String(inputs.finds);
    let nombre = _.startCase(_.lowerCase(String(inputs.finds)));
    let nit = _.startCase(_.lowerCase(String(inputs.finds)));
    let consecutivo = _.startCase(_.lowerCase(String(inputs.finds)));
    let status = _.startCase(_.lowerCase(String(inputs.finds)));

    // Filtro
    let findContainer = [
      { 'id':           { 'contains': uid } },
      { 'nombre':       { 'contains': nombre } },
      { 'status':       { 'contains': status } },
      { 'nit':          { 'contains': nit } },
      { 'consecutive':  { 'contains': consecutivo } },
      { 'nombre':       { 'contains': inputs.finds } },
      { 'status':       { 'contains': inputs.finds } },
      { 'nit':          { 'contains': inputs.finds } },
      { 'consecutive':  { 'contains': inputs.finds } },
    ];

    // funcion de buscador, donde buscara de los 3 la funcion
    let findBank = await Banks.find()
      .where({
        'or': findContainer,
        // 'and': [{'role': {'>=':rq.me.role}}]
      })
      .limit(inputs.lim)
      .skip(inputs.lim * inputs.sk)
      .select(['id', 'nombre', 'nit', 'consecutive', 'status']);

    // Cuenta el numero de resultados
    count = findBank.length;

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'banks',
      count: count,
      list: findBank
    });

  }


};
