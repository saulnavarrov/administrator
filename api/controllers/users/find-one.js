/**
 * find-search.js
 *
 * @description :: Mirar abajo la description ► ↓↓↓
 *
 * @src {{proyect}}/api/controllers/users/find-search.js
 * @author Saul Navarrov <Sinavarrov@gmail.com>
 * @created 2019/01/28
 * @version 1.0
 */
module.exports = {

  friendlyName: 'Find one',

  description: 'Buscador de usuario en concreto',

  extendedDescription: `Se busca un usuario en especifico para visualizar por completo
  todos, este require el "ID" que se encuentra en la base de datos.`,

  inputs: {
    id: {
      type: 'string',
      defaultsTo: '',
      description: `buscara el usuario con la id`
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
    /***************************************************************************************
     * VARIABLES INICIALES
     ***************************************************************************************/
    const rq = this.req;
    const _ = require('lodash');
    const moment = require('moment');
    const userId = rq.session.userId;
    const isSocket = rq.isSocket;
    let users = []; // array de usuario nuevo
    let count = 0;

    // Configurando Moment
    moment.locale(sails.config.custom.localeMoment);


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD SOCKET
     ***************************************************************************************/
    // Solo se aceptan solicitudes atravez de socket.io
    if (!rq.isSocket) {
      return exits.noAuthorize({
        error: true,
        message: `Solicitud Rechazada.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE SEGURIDAD DE USUARIOS HABILITADOS
     ***************************************************************************************/
    // Verificacion de usuario
    if (!rq.session.userId) {
      return exits.unauthorized({
        error: true,
        message: 'Unauthorized'
      });
    }

    // Busco el usuario para verificar si tiene el roll suficiente para  hacer el procedimiento
    let user = await Users.findOne({
      'id': userId
    });
    let autorize = user.role <= 2 ? true : false; // Autorización de usuarios

    // Verifico que usuario tiene pases de seguridad para visualizar los datos del usuario
    // Solo los administradores y supervisores pueden ver los datos de los usuarios en concreto
    // para trabajar de uniempresas
    if (!autorize) {
      return exits.noAuthorize({
        error: true,
        message: `No tienes permisos para realizar esta acción.
        Comunicate con el Administrador para obtener permisos
        necesarios.`
      });
    }


    /***************************************************************************************
     * BLOQUE DE DATOS OBLIGATORIOS Y REVISION DE DATA.
     ***************************************************************************************/
    // Verificando que esta pidiendo datos de un usuario y no venga vacio
    if (inputs.id.length === 0) {
      return exits.notFound({
        model: 'users',
        count: 0,
        error: true,
        message: `No se encontraron datos en la busqueda del id este usuario: '${inputs.id}'`
      });
    }


    /***************************************************************************************
     * BLOQUE DE TRABAJO
     ***************************************************************************************/
    // funcion de buscador, donde buscara de los 3 la funcion
    let findOneUser = await Users.findOne({
      'id': inputs.id,
      'and': [{ 'role': {'>=':rq.me.role} }]
    })
    .omit(['password']);

    // Cuenta el numero de resultados
    count = 1;

    // Protegiendo el Password para no visualizarlo en Json
    if (findOneUser.role > 1) {
      delete findOneUser.isSuperAdmin;
    }

    // Change Data Time
    findOneUser.lastSeenAt = moment(findOneUser.lastSeenAt).fromNow();
    findOneUser.createdAt = moment(findOneUser.createdAt).format('llll');
    findOneUser.updatedAt = moment(findOneUser.updatedAt).format('llll');
    findOneUser.emailProofTokenExpiresAt = findOneUser.emailProofTokenExpiresAt === 0 ? 0 : moment(findOneUser.emailProofTokenExpiresAt).format('llll');
    findOneUser.passwordResetTokenExpiresAt = findOneUser.passwordResetTokenExpiresAt === 0 ? 0 : moment(findOneUser.passwordResetTokenExpiresAt).format('llll');

    // Retorna todos los datos si es correcto
    return exits.success({
      model: 'users',
      count: count,
      user: findOneUser
    });
  }
};
