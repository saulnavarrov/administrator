/**
 * find-one.js
 * @description :: Mirar abajo la description ► ↓↓↓
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find one bank',

  description: `Busca un banco especifico y lo devuelve para ser visto en el modal.`,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el banco con la id`
    },
  },


  exits: {
    success: {
      description: 'Entrega de banco Exitosa.'
    },

    notFound: {
      responseType: 'notFound',
      description: 'Datos no encontrados de los banco o no existe ninguno'
    },

    unauthorized: {
      statusCode: 401,
      responseType: 'unauthorized',
      description: 'No autorizado para ver los resultados de la pagina'
    }
  },


  fn: async function (inputs, exits) {
    // Variables principales
    let _ = require('lodash');
    let moment = require('moment');
    let rq = this.req;
    let userId = rq.session.userId;
    let isSocket = rq.isSocket;
    let count = 0;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);

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

    // funcion de buscador, donde buscara de los 3 la funcion
    let findOneBank = await Banks.findOne({
      'id': inputs.id,
      // 'and': [{ 'role': {'>=':rq.me.role} }]
    });

    // Cuenta el numero de resultados
    count = 1;

    // Protegiendo el Password para no visualizarlo en Json
    //

    // Change Data Time
    findOneBank.createdAt = moment(findOneBank.createdAt).format('llll');
    findOneBank.updatedAt = moment(findOneBank.updatedAt).format('llll');

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'banks',
      count: count,
      one: findOneBank
    });

  }


};
